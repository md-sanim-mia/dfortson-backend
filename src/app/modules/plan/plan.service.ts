import { Plan, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { stripe } from "../../utils/stripe";
import AppError from "../../errors/AppError";
import status from "http-status";

const createPlan = async (payload: Plan) => {
  const result = await prisma.$transaction(async (tx) => {
    // Step 1: Create Product in Stripea
    console.log("Creating Stripe Product with payload:", payload);

    const product = await stripe.products.create({
      name: payload.planName,
      description: payload.description!,
      active: true,
    });

    // Step 2: Create Price in Stripe
    // const recurringData: any = {
    //   interval: payload.interval,
    //   interval_count: payload.intervalCount,
    // };
      let recurringData: any = undefined;
    if (payload.planName.toLowerCase() === "lifetime") {
      recurringData = {
        interval: "year",
        interval_count: 1000, // Lifetime হিসেবে ধরবে
      };
    } else {
      recurringData = {
        interval: payload.interval,
        interval_count: payload.intervalCount,
      };
    }

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: Math.round(payload.amount * 100),
      active: true,
      recurring: recurringData,
      product: product.id,
    });
    // console.log("Stripe Product and Price created:", price);

    // Step 3: Create Plan Record in Database
    const dbPlan = await tx.plan.create({
      data: {
        amount: payload.amount || 0,
        planName: payload.planName,
        currency: "usd",
        interval: payload.interval,
        intervalCount: payload.intervalCount,
        productId: product.id,
        priceId: price.id,
        active: payload.active || true,
        description: payload.description,
        features: payload.features || [],
      },
    });

    console.log("Database Plan created:", dbPlan);
    return dbPlan;
  });
  return result;
};

export const updatePlan = async (planId: string, payload: Partial<Plan>) => {
  let newPriceId: string | null = null;
  let oldPriceId: string | null = null;
  let stripePriceCreated = false;
  let productIdToUse: string;

  try {
    console.log("=== Update Plan Start ===");

    // Step 1: Find existing plan
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new AppError(status.NOT_FOUND, `Plan with ID ${planId} not found`);
    }

    oldPriceId = existingPlan.priceId;
    productIdToUse = existingPlan.productId;

    // Step 2: Check if Stripe product exists, create if missing
    try {
      await stripe.products.retrieve(productIdToUse);
    } catch (err: any) {
      if (err.code === "resource_missing") {
        console.warn(
          `Stripe product ${productIdToUse} not found. Creating new product...`
        );

        const newProduct = await stripe.products.create({
          name: payload.planName ?? existingPlan.planName,
          description: payload.description ?? existingPlan.description ?? "",
          active: payload.active ?? existingPlan.active ?? true,
        });

        productIdToUse = newProduct.id;

        // Save new productId to DB immediately
        await prisma.plan.update({
          where: { id: planId },
          data: { productId: productIdToUse },
        });
      } else {
        throw err;
      }
    }

    // Step 3: Prepare update data - using a more flexible approach
    const updateData: any = {
      priceId: newPriceId, // Will be set later
      productId: productIdToUse,
    };

    // Only add fields that are actually being updated
    if (payload.planName !== undefined) {
      updateData.planName = payload.planName;
    }
    if (payload.amount !== undefined) {
      updateData.amount = payload.amount;
    }
    if (payload.currency !== undefined) {
      updateData.currency = payload.currency;
    }
    if (payload.interval !== undefined) {
      updateData.interval = payload.interval;
    }
    if (payload.intervalCount !== undefined) {
      updateData.intervalCount = payload.intervalCount;
    }
    if (payload.freeTrialDays !== undefined) {
      updateData.freeTrialDays = payload.freeTrialDays;
    }
    if (payload.active !== undefined) {
      updateData.active = payload.active;
    }
    if (payload.description !== undefined) {
      updateData.description = payload.description;
    }
    if (payload.features !== undefined) {
      updateData.features = payload.features;
    }

    // Step 4: Update Stripe product if needed
    if (
      payload.planName !== undefined ||
      payload.description !== undefined ||
      payload.active !== undefined
    ) {
      await stripe.products.update(productIdToUse, {
        name: payload.planName ?? existingPlan.planName,
        description: payload.description ?? existingPlan.description ?? "",
        active: payload.active ?? existingPlan.active ?? true,
      });
    }

    // Step 5: Safety check before creating price
    try {
      await stripe.products.retrieve(productIdToUse);
    } catch {
      throw new AppError(
        status.BAD_REQUEST,
        `Stripe product ${productIdToUse} is invalid. Cannot create price.`
      );
    }

    // Step 6: FINAL FIX - Proper type conversion and comparison
    console.log("=== FINAL PRICING CHECK ===");
    
    // Convert all values to proper types for comparison
    const currentAmount = Number(existingPlan.amount) || 0;
    const currentCurrency = String(existingPlan.currency || '').toLowerCase();
    const currentInterval = String(existingPlan.interval || '');
    const currentIntervalCount = Number(existingPlan.intervalCount) || 1;
    
    // Only check if payload actually has these fields AND they're different
    let pricingChanged = false;
    let changeDetails = [];

    if (payload.amount !== undefined) {
      const newAmount = Number(payload.amount) || 0;
      if (newAmount !== currentAmount) {
        pricingChanged = true;
        changeDetails.push(`amount: ${currentAmount} → ${newAmount}`);
      }
    }

    if (payload.currency !== undefined) {
      const newCurrency = String(payload.currency).toLowerCase();
      if (newCurrency !== currentCurrency) {
        pricingChanged = true;
        changeDetails.push(`currency: ${currentCurrency} → ${newCurrency}`);
      }
    }

    if (payload.interval !== undefined) {
      const newInterval = String(payload.interval);
      if (newInterval !== currentInterval) {
        pricingChanged = true;
        changeDetails.push(`interval: ${currentInterval} → ${newInterval}`);
      }
    }

    if (payload.intervalCount !== undefined) {
      const newIntervalCount = Number(payload.intervalCount) || 1;
      if (newIntervalCount !== currentIntervalCount) {
        pricingChanged = true;
        changeDetails.push(`intervalCount: ${currentIntervalCount} → ${newIntervalCount}`);
      }
    }

    console.log("Current values:", { currentAmount, currentCurrency, currentInterval, currentIntervalCount });
    console.log("Payload values:", { 
      amount: payload.amount, 
      currency: payload.currency, 
      interval: payload.interval, 
      intervalCount: payload.intervalCount 
    });
    console.log("Pricing changed:", pricingChanged);
    console.log("Changes:", changeDetails);
    console.log("=== END CHECK ===");

    if (pricingChanged) {
      console.log("🔥 Creating NEW Stripe price due to changes:", changeDetails.join(', '));

      // Use final values (payload takes priority, fallback to current)
      const finalAmount = payload.amount !== undefined ? Number(payload.amount) : currentAmount;
      const finalCurrency = payload.currency !== undefined ? payload.currency : existingPlan.currency;
      const finalInterval = payload.interval !== undefined ? payload.interval : existingPlan.interval;
      const finalIntervalCount = payload.intervalCount !== undefined ? Number(payload.intervalCount) : currentIntervalCount;

      const priceConfig: any = {
        currency: finalCurrency,
        unit_amount: Math.round(finalAmount * 100),
        active: true,
        product: productIdToUse,
      };

      if (finalInterval && finalIntervalCount) {
        priceConfig.recurring = {
          interval: finalInterval,
          interval_count: finalIntervalCount,
        };
      }

      console.log("Creating price with config:", priceConfig);

      const newPrice = await stripe.prices.create(priceConfig);
      newPriceId = newPrice.id;
      stripePriceCreated = true;

      // Deactivate old price
      if (oldPriceId) {
        try {
          await stripe.prices.update(oldPriceId, { active: false });
          console.log(`✅ Deactivated old price: ${oldPriceId}`);
        } catch (err: any) {
          if (err.code === "resource_missing") {
            console.warn(`⚠️ Old price ${oldPriceId} not found in Stripe`);
          } else {
            throw err;
          }
        }
      }
    } else {
      // NO changes detected - keep existing price
      newPriceId = existingPlan.priceId;
      console.log("✅ NO PRICING CHANGES - Keeping existing Stripe price:", newPriceId);
    }

    // Update the priceId in updateData
    updateData.priceId = newPriceId;

    // Step 7: Update plan in DB (Prisma transaction)
    const updatedPlan = await prisma.$transaction(async (tx) => {
      return tx.plan.update({
        where: { id: planId },
        data: updateData,
      });
    });

    console.log("=== Update Plan Success ===");
    return updatedPlan;
  } catch (error) {
    console.error("Update Plan Error:", error);

    // Rollback Stripe price if DB fails
    if (stripePriceCreated && newPriceId) {
      try {
        await stripe.prices.update(newPriceId, { active: false });
        if (oldPriceId) {
          await stripe.prices.update(oldPriceId, { active: true });
        }
      } catch (rollbackError) {
        console.error("Failed to rollback Stripe price:", rollbackError);
      }
    }

    throw error instanceof AppError
      ? error
      : new AppError(status.INTERNAL_SERVER_ERROR, error as any);
  }
};
// Get All Plans
const getAllPlans = async () => {
  const plans = await prisma.plan.findMany();
  return plans;
};

// Get a Single Plan by ID
const getPlanById = async (planId: string) => {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  return plan;
};

// // Delete Plan
const deletePlan = async (planId: string) => {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Find the plan record in the database
    const plan = await tx.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error(`Plan with ID ${planId} not found`);
    }

    // Step 2: Deactivate the price in Stripe
    await stripe.prices.update(plan.priceId, { active: false });

    // Step 3: Deactivate the product in Stripe
    await stripe.products.update(plan.productId, { active: false });

    // Step 4: Delete the plan record in the database
    await tx.plan.delete({
      where: { id: planId },
    });

    return {
      message: `Plan with ID ${planId} archived and deleted successfully`,
    };
  });
};

export const PlanServices = {
  createPlan,
  getAllPlans,
  getPlanById,
  deletePlan,
  updatePlan,
};
