"use client"
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, GraduationCap, DollarSign, Clock, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Label } from "@/app/_components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";
import { Badge } from "@/app/_components/ui/badge";
import {useRouter} from "next/navigation";

export default function CandidateAdd() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        education: "",
        expectedSalary: "",
        availability: "",
        source: "",
        summary: "",
    });

    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState("");

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleAddSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()]);
            setCurrentSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            skills,
            status: "AVAILABLE",
            joinedDate: new Date().toISOString(),
        });
    };

    const isFormValid = () => {
        return (
            formData.name &&
            formData.email &&
            formData.phone &&
            formData.location &&
            formData.experience &&
            formData.education
        );
    };

    const onSave = (data: any) => {

    }

    const onBack = () => {
        router.back();
    }

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Add New Candidate</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Add a new candidate to your talent pool
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Ahmad Rizki"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+62 812-3456-7890"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                placeholder="e.g. Jakarta Selatan"
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="source">Source</Label>
                            <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                                <SelectTrigger id="source">
                                    <SelectValue placeholder="Select source..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Job Portal">Job Portal</SelectItem>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="Direct Application">Direct Application</SelectItem>
                                    <SelectItem value="Recruitment Event">Recruitment Event</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Briefcase className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Professional Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="experience">Years of Experience *</Label>
                            <Input
                                id="experience"
                                placeholder="e.g. 3 years"
                                value={formData.experience}
                                onChange={(e) => handleInputChange("experience", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="education">Education *</Label>
                            <Input
                                id="education"
                                placeholder="e.g. S1 Informatika - Universitas Indonesia"
                                value={formData.education}
                                onChange={(e) => handleInputChange("education", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="expectedSalary">Expected Salary</Label>
                            <Input
                                id="expectedSalary"
                                placeholder="e.g. Rp 10.000.000"
                                value={formData.expectedSalary}
                                onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="availability">Availability</Label>
                            <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
                                <SelectTrigger id="availability">
                                    <SelectValue placeholder="Select availability..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Immediate">Immediate</SelectItem>
                                    <SelectItem value="1 week notice">1 week notice</SelectItem>
                                    <SelectItem value="2 weeks notice">2 weeks notice</SelectItem>
                                    <SelectItem value="1 month notice">1 month notice</SelectItem>
                                    <SelectItem value="2 months notice">2 months notice</SelectItem>
                                    <SelectItem value="3 months notice">3 months notice</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="summary">Professional Summary</Label>
                            <Textarea
                                id="summary"
                                placeholder="Brief description of the candidate's background, skills, and experience..."
                                value={formData.summary}
                                onChange={(e) => handleInputChange("summary", e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <GraduationCap className="w-5 h-5 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Skills & Technologies</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a skill (e.g. React, Node.js, etc.)"
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Button
                                type="button"
                                onClick={handleAddSkill}
                                variant="outline"
                                className="shrink-0"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="bg-pink-50 text-pink-700 px-3 py-1.5 text-sm"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="ml-2 hover:text-pink-900"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid()}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        Add Candidate
                    </Button>
                </div>
            </form>
        </div>
    );
}
