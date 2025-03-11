import React from 'react';

interface PatientInfoStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  updateFormData: (data: Partial<{ name: string; email: string; phone: string }>) => void;
  goToNextStep: () => void;
}

export const PatientInfoStep: React.FC<PatientInfoStepProps> = ({
  formData,
  updateFormData,
  goToNextStep,
}) => {
  const [errors, setErrors] = React.useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      goToNextStep();
    }
  };

  return (
    <div className="form-step">
      <h2 className="form-title">Patient Information</h2>
      <p className="form-subtitle">
        Please provide your basic contact information so we can better serve you.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="form-input"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="form-button-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}; 