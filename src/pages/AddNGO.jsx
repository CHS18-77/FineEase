```javascript
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const AddNGO = () => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    description: '',
    address: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/ngo/add', formData);
      toast.success('NGO registered successfully! Waiting for approval.');
      navigate('/ngo');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register NGO');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register NGO</h1>
        <p className="text-gray-600 mt-1">Submit your organization details for verification.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="NGO Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Registration Number"
              name="registrationNumber"
              required
              value={formData.registrationNumber}
              onChange={handleChange}
            />
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <Input
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
            />
            <Input
              label="Contact Phone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isLoading}>
              Submit Registration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddNGO;
```
