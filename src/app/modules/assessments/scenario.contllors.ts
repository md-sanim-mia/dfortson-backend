import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ScenarioService } from "./scenario.services";

// Create
const createScenario = catchAsync(async (req, res) => {
  const files = req.files as any
  const data = req.body;
  

  // Validation
  if (!files || !files?.scenario) {
    throw new AppError(400, "Scenario file is required");
  }
  if (!files || !files?.speech) {
    throw new AppError(400, "speech file is required");
  }
  if (!files || !files?.markingPointer) {
    throw new AppError(400, "markingPointer file is required");
  }

  // File paths extract করা 

 const fileDetails = {
    scenario: files?.scenario ? {
     fileUrl: files.scenario[0].path,
      filename: files.scenario[0].filename,
      originalname: files.scenario[0].originalname,
      mimetype: files.scenario[0].mimetype,
      size: files.scenario[0].size
    } : null,
    speech: files?.speech ? {
     fileUrl: files.speech[0].path,
      filename: files.speech[0].filename,
      originalname: files.speech[0].originalname,
      mimetype: files.speech[0].mimetype,
      size: files.speech[0].size
    } : null,
    markingPointer: files?.markingPointer ? {
    fileUrl: files.markingPointer[0].path,
      filename: files.markingPointer[0].filename,
      originalname: files.markingPointer[0].originalname,
      mimetype: files.markingPointer[0].mimetype,
      size: files.markingPointer[0].size
    } : null,
    additionalDocument: files?.additionalDocument ? {
    fileUrl: files.additionalDocument[0].path,
      filename: files.additionalDocument[0].filename,
      originalname: files.additionalDocument[0].originalname,
      mimetype: files.additionalDocument[0].mimetype,
      size: files.additionalDocument[0].size
    } : null,
  };
  
  // Database এ save করার জন্য data prepare করা
  const scenarioData = {
    ...data,
     scenario: fileDetails.scenario,
    speech: fileDetails.speech,
    markingPointer: fileDetails.markingPointer,
    additionalDocument: fileDetails.additionalDocument,
  };
  
const result=await ScenarioService.createScenario(scenarioData)
  
  
  sendResponse(res, {
    statusCode: 201,
    message: "assessment created successfully",
    data:result
  });
});


// Get all
const getAllScenarios = catchAsync(async (req, res) => {
  const result = await ScenarioService.getAllScenarios();

  sendResponse(res, {
    statusCode: 200,
    message: "assessment retrieved successfully",
    data: result,
  });
});
const getAllScenariosForStudent = catchAsync(async (req, res) => {
  const result = await ScenarioService.getAllScenariosForStudent();

  sendResponse(res, {
    statusCode: 200,
    message: "assessment retrieved successfully ",
    data: result,
  });
});

// Get single
const getSingleScenario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScenarioService.getSingleScenario(id);

  sendResponse(res, {
    statusCode: 200,
    message: "assessment retrieved successfully",
    data: result,
  });
});

// Update
const updateScenario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as any
  const data = req.body;
const fileDetails = {} as any

if (files?.scenario) {
  fileDetails.scenario = {
    fileUrl: files.scenario[0].path,
    filename: files.scenario[0].filename,
    originalname: files.scenario[0].originalname,
    mimetype: files.scenario[0].mimetype,
    size: files.scenario[0].size
  };
}

if (files?.speech) {
  fileDetails.speech = {
    fileUrl: files.speech[0].path,
    filename: files.speech[0].filename,
    originalname: files.speech[0].originalname,
    mimetype: files.speech[0].mimetype,
    size: files.speech[0].size
  };
}

if (files?.markingPointer) {
  fileDetails.markingPointer = {
    fileUrl: files.markingPointer[0].path,
    filename: files.markingPointer[0].filename,
    originalname: files.markingPointer[0].originalname,
    mimetype: files.markingPointer[0].mimetype,
    size: files.markingPointer[0].size
  };
}

if (files?.additionalDocument) {
  fileDetails.additionalDocument = {
    fileUrl: files.additionalDocument[0].path,
    filename: files.additionalDocument[0].filename,
    originalname: files.additionalDocument[0].originalname,
    mimetype: files.additionalDocument[0].mimetype,
    size: files.additionalDocument[0].size
  };
}

const scenarioUpdateData = {
  ...data,
  ...fileDetails  // শুধুমাত্র existing files merge হবে
};
console.log(scenarioUpdateData)
  const result = await ScenarioService.updateScenario(id,scenarioUpdateData);

  sendResponse(res, {
    statusCode: 200,
    message: "assessment updated successfully",
    data: result,
  });
});

// Delete
const deleteScenario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScenarioService.deleteScenario(id);

  sendResponse(res, {
    statusCode: 200,
    message: "assessment deleted successfully",
    data: result,
  });
});

export const ScenarioController = {
  createScenario,
  getAllScenarios,
  getSingleScenario,
  updateScenario,
  deleteScenario,
  getAllScenariosForStudent
};
