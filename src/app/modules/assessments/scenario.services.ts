import status from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import axios from "axios";
import config from "../../config";

// Create a new Scenario
const createScenario = async (payload: any) => {
  if (!payload) {
    throw new AppError(status.BAD_REQUEST, "payload data  is messing  ");
  }

  const result = await prisma.scenario.create({ data: { ...payload } });
const scenario_id=result.id
console.log(scenario_id)
  const apiUrl = `http://206.162.244.131:8003/speech/generate-from-scenario?scenario_id=${scenario_id}`;
  const response = await axios.post(apiUrl,{
    headers: { "Content-Type": "application/json" },
  });

  const aiData = response.data || {};
  console.log(aiData)
console.log(result.id)
  return result;
};

// Get all Scenarios
const getAllScenarios = async () => {
  const result = (await prisma.scenario.findMany({include:{ReferenceAudio:true}}))
  return result;
};
const getAllScenariosForStudent = async () => {
  const result = await prisma.scenario.findMany({
    select: {
      id: true,
      description: true,
      title: true,
      scenario: true,
      markingPointer: true,
      additionalDocument: true,
speech:false,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

// Get a single Scenario by ID
const getSingleScenario = async (id: string) => {
  if (!id) throw new Error("Scenario ID is required");

  const result = await prisma.scenario.findUnique({
    where: { id },
  });
  return result;
};

// Update a Scenario by ID
const updateScenario = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    scenario: any;
    Speech: any;
    markingPointer: any;
    additionalDocument?: any;
  }>
) => {
  if (!id) throw new Error("Scenario ID is required");

  const result = await prisma.scenario.update({
    where: { id },
    data,
  });

  const apiUrl = `${config.ai_base_url}/speech/generate-from-scenario/${result.id}`;
  const response = await axios.post(apiUrl,{
    headers: { "Content-Type": "application/json" },
  });
  return result;
};

// Delete a Scenario by ID
const deleteScenario = async (id: string) => {
  if (!id) throw new Error("Scenario ID is required");

  const result = await prisma.scenario.delete({
    where: { id },
  });
  return result;
};

export const ScenarioService = {
  createScenario,
  getAllScenarios,
  getSingleScenario,
  updateScenario,
  deleteScenario,
  getAllScenariosForStudent
};
