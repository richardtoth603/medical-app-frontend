// SignUpForm.tsx

import React, { useState } from 'react';
//import { v4 as uuidv4 } from 'uuid';

type Role = 'patient' | 'doctor';

interface SignUpFormProps {
    onSubmit: (formData: UserSignUpData) => void;
}

export interface UserSignUpData {
    Id: string;
    UserName: string;
    Email: string;
    FirstName: string;
    LastName: string;
    Role: Role;
    DateOfBirth: string; // Date as ISO string for form handling
    Specialty?: string; // Only applicable if Role is 'doctor'
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<UserSignUpData>({
        Id: "uuidv4()",
        UserName: '',
        Email: '',
        FirstName: '',
        LastName: '',
        Role: 'patient',
        DateOfBirth: '',
        Specialty: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const role = e.target.value as Role;
        setFormData({
            ...formData,
            Role: role,
            Specialty: role === 'doctor' ? '' : undefined
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <div className="form-group">
                <label htmlFor="UserName">User Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="UserName"
                    name="UserName"
                    value={formData.UserName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="Email">Email:</label>
                <input
                    type="email"
                    className="form-control"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="FirstName">First Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="FirstName"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="LastName">Last Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="LastName"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Role:</label>
                <div className="form-check">
                    <input
                        type="radio"
                        className="form-check-input"
                        id="patientRole"
                        name="Role"
                        value="patient"
                        checked={formData.Role === 'patient'}
                        onChange={handleRoleChange}
                    />
                    <label className="form-check-label" htmlFor="patientRole">Patient</label>
                </div>
                <div className="form-check">
                    <input
                        type="radio"
                        className="form-check-input"
                        id="doctorRole"
                        name="Role"
                        value="doctor"
                        checked={formData.Role === 'doctor'}
                        onChange={handleRoleChange}
                    />
                    <label className="form-check-label" htmlFor="doctorRole">Doctor</label>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="DateOfBirth">Date of Birth:</label>
                <input
                    type="date"
                    className="form-control"
                    id="DateOfBirth"
                    name="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleChange}
                    required
                />
            </div>
            {formData.Role === 'doctor' && (
                <div className="form-group">
                    <label htmlFor="Specialty">Specialty:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Specialty"
                        name="Specialty"
                        value={formData.Specialty || ''}
                        onChange={handleChange}
                        required={formData.Role === 'doctor'}
                    />
                </div>
            )}
            <button type="submit" className="btn btn-primary mt-3">Sign Up</button>
        </form>
    );
};

export default SignUpForm;
