import { useState, useEffect } from 'react';
import { TagIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ghlApi from '../utils/ghlApi';

const TAG_COLORS = [
  '#3498db', // Blue
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#9b59b6', // Purple
  '#1abc9c', // Teal
  '#34495e', // Dark Blue
  '#e67e22', // Dark Orange
  '#27ae60', // Dark Green
  '#c0392b', // Dark Red
];

export default function TagManager({ patients, selectedPatients, setSelectedPatients }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3498db');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [locationId, setLocationId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);

  // Initialize the API and fetch data when component mounts
  useEffect(() => {
    const initialize = async () => {
      // Get locationId from URL query params or use default
      const params = new URLSearchParams(window.location.search);
      const locId = params.get('locationId') || process.env.NEXT_PUBLIC_GHL_DEFAULT_LOCATION_ID;
      
      if (locId) {
        setLocationId(locId);
        const initialized = ghlApi.initializeApi();
        setIsInitialized(initialized);
        
        if (initialized) {
          await fetchTags(locId);
        }
      }
    };
    
    initialize();
  }, []);

  // Fetch tags from GHL
  const fetchTags = async (locId) => {
    setLoading(true);
    setError('');
    
    try {
      const tagsData = await ghlApi.fetchTags(locId);
      setTags(tagsData);
    } catch (err) {
      setError('Failed to fetch tags from GoHighLevel. Please check your API token.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new tag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    
    if (!newTagName.trim()) {
      setError('Please enter a tag name');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const newTag = await ghlApi.createTag(locationId, newTagName, newTagColor);
      setTags([...tags, newTag]);
      setNewTagName('');
      setSuccess(true);
      setShowCreateTag(false);
      
      // Auto-select the newly created tag
      setSelectedTags([...selectedTags, newTag.id]);
      
    } catch (err) {
      setError('Failed to create tag. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding tags to contacts
  const handleAddTags = async () => {
    if (selectedTags.length === 0) {
      setError('Please select at least one tag');
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
      await ghlApi.addTagsToContacts(locationId, patientIds, selectedTags);
      setSuccess(true);
      // Reset selection after successful operation
      setSelectedPatients([]);
    } catch (err) {
      setError('Failed to add tags to patients. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle tag selection
  const toggleTagSelection = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // If API is not initialized, show a message
  if (!isInitialized) {
    return (
      <div className="card mb-6 bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Tag Manager</h3>
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Tag Manager</h3>
        <button
          type="button"
          onClick={() => setShowCreateTag(!showCreateTag)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Create Tag
        </button>
      </div>
      
      {/* Create Tag Form */}
      {showCreateTag && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Create New Tag</h4>
          <form onSubmit={handleCreateTag} className="space-y-4">
            <div>
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name
              </label>
              <input
                type="text"
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter tag name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Color
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      newTagColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateTag(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Tag'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Available Tags */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Available Tags</h4>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => toggleTagSelection(tag.id)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  selectedTags.includes(tag.id)
                    ? 'text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
                  borderWidth: '1px',
                  borderColor: tag.color,
                }}
              >
                <TagIcon className="h-4 w-4 mr-1" />
                {tag.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tags available. Create your first tag!</p>
        )}
      </div>
      
      {/* Patient Selection Info */}
      <div className="mb-6 bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-700">
          {selectedPatients.length > 0 
            ? `${selectedPatients.length} patients selected` 
            : `All ${patients.length} filtered patients will be tagged`}
        </p>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddTags}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading || selectedTags.length === 0}
        >
          <TagIcon className="h-4 w-4 mr-2" />
          {loading ? 'Processing...' : 'Apply Tags'}
        </button>
      </div>
      
      {/* Success/Error Messages */}
      {success && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Tags successfully applied to patients.
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