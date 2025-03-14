import { useState, useEffect } from 'react';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ghlApi from '../utils/ghlApi';

export default function GHLIntegration({ patients, selectedPatients, setSelectedPatients }) {
  const [workflows, setWorkflows] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [pipelineStages, setPipelineStages] = useState({});
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [locationId, setLocationId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [integrationType, setIntegrationType] = useState('workflow'); // 'workflow', 'pipeline', or 'trigger'

  // Initialize the API and fetch data when component mounts
  useEffect(() => {
    const initialize = async () => {
      // Get locationId from URL query params
      const params = new URLSearchParams(window.location.search);
      const locId = params.get('locationId');
      
      if (locId) {
        setLocationId(locId);
        const initialized = ghlApi.initializeApi();
        setIsInitialized(initialized);
        
        if (initialized) {
          await fetchWorkflowsAndPipelines(locId);
        }
      }
    };
    
    initialize();
  }, []);

  // Fetch workflows and pipelines from GHL
  const fetchWorkflowsAndPipelines = async (locId) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch workflows
      const workflowsData = await ghlApi.fetchWorkflows(locId);
      setWorkflows(workflowsData);
      
      // Fetch pipelines
      const pipelinesData = await ghlApi.fetchPipelines(locId);
      setPipelines(pipelinesData);
      
      // Create a map of pipeline stages
      const stagesMap = {};
      pipelinesData.forEach(pipeline => {
        stagesMap[pipeline.id] = pipeline.stages || [];
      });
      setPipelineStages(stagesMap);
      
    } catch (err) {
      setError('Failed to fetch data from GoHighLevel. Please check your API token.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding patients to a workflow
  const handleAddToWorkflow = async () => {
    if (!selectedWorkflow) {
      setError('Please select a workflow');
      return;
    }
    
    const patientIds = selectedPatients.length > 0 
      ? selectedPatients.map(p => p.id) 
      : patients.map(p => p.id);
    
    if (patientIds.length === 0) {
      setError('No patients selected');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await ghlApi.addContactsToWorkflow(locationId, selectedWorkflow, patientIds);
      setSuccess(true);
      // Reset selection after successful operation
      setSelectedPatients([]);
    } catch (err) {
      setError('Failed to add patients to workflow. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding patients to a pipeline
  const handleAddToPipeline = async () => {
    if (!selectedPipeline || !selectedStage) {
      setError('Please select a pipeline and stage');
      return;
    }
    
    const patientIds = selectedPatients.length > 0 
      ? selectedPatients.map(p => p.id) 
      : patients.map(p => p.id);
    
    if (patientIds.length === 0) {
      setError('No patients selected');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await ghlApi.addContactsToPipeline(locationId, selectedPipeline, selectedStage, patientIds);
      setSuccess(true);
      // Reset selection after successful operation
      setSelectedPatients([]);
    } catch (err) {
      setError('Failed to add patients to pipeline. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission based on integration type
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (integrationType === 'workflow') {
      handleAddToWorkflow();
    } else if (integrationType === 'pipeline') {
      handleAddToPipeline();
    }
  };

  // If API is not initialized, show a message
  if (!isInitialized) {
    return (
      <div className="card mb-6 bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">GoHighLevel Integration</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                GoHighLevel API token not found. Please add your API token to the environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-6 bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">GoHighLevel Integration</h3>
      
      {/* Integration Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Integration Type
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setIntegrationType('workflow')}
            className={`px-4 py-2 rounded-md ${
              integrationType === 'workflow' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Workflow
          </button>
          <button
            type="button"
            onClick={() => setIntegrationType('pipeline')}
            className={`px-4 py-2 rounded-md ${
              integrationType === 'pipeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pipeline
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Workflow Selection */}
        {integrationType === 'workflow' && (
          <div className="mb-4">
            <label htmlFor="workflow" className="block text-sm font-medium text-gray-700 mb-2">
              Select Workflow
            </label>
            <select
              id="workflow"
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a workflow</option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Pipeline Selection */}
        {integrationType === 'pipeline' && (
          <>
            <div className="mb-4">
              <label htmlFor="pipeline" className="block text-sm font-medium text-gray-700 mb-2">
                Select Pipeline
              </label>
              <select
                id="pipeline"
                value={selectedPipeline}
                onChange={(e) => {
                  setSelectedPipeline(e.target.value);
                  setSelectedStage('');
                }}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a pipeline</option>
                {pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedPipeline && (
              <div className="mb-4">
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Stage
                </label>
                <select
                  id="stage"
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a stage</option>
                  {pipelineStages[selectedPipeline]?.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
        
        {/* Patient Selection Info */}
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700">
            {selectedPatients.length > 0 
              ? `${selectedPatients.length} patients selected` 
              : `All ${patients.length} filtered patients will be added`}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => fetchWorkflowsAndPipelines(locationId)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {loading ? 'Processing...' : `Add to ${integrationType === 'workflow' ? 'Workflow' : 'Pipeline'}`}
          </button>
        </div>
      </form>
      
      {/* Success/Error Messages */}
      {success && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Patients successfully added to {integrationType === 'workflow' ? 'workflow' : 'pipeline'}.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 