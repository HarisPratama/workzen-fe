"use client"
import { ArrowLeft, Building2, Briefcase, Users, DollarSign, MapPin, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {useForm, Controller} from "react-hook-form";

interface ManpowerRequestCreateProps {
  onBack: () => void;
  onSave: (data: any) => void;
  clients: any[],
  loading: boolean,
}

export function ManpowerRequestCreate({ onBack, onSave, clients, loading }: ManpowerRequestCreateProps) {
  const {register, control, handleSubmit} = useForm()


  const onSubmit = async (data: any) => {
    onSave(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Create Manpower Request</h2>
          <p className="text-sm text-gray-600 mt-1">Fill in the details for new manpower requirement</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Client Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Building2 className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold text-gray-900">Client Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client Name *</Label>
                  <Controller
                      name="client_id"
                      control={control}
                      render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                            <SelectTrigger id="client_id">
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>

                            <SelectContent>
                              {clients.map((client) => (
                                  <SelectItem key={client.id} value={String(client.id)}>
                                    {client.company_name}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                      )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="e.g., Jakarta Selatan"
                      {...register("work_location")}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Briefcase className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold text-gray-900">Position Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="position">Position Title *</Label>
                  <Input
                    placeholder="e.g., Software Engineer"
                    {...register("position")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredCount">Number of Positions *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      min="1"
                      placeholder="e.g., 5"
                      {...register("required_count")}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary (IDR) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g., 8000000"
                      {...register("salary_min")}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary (IDR) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g., 12000000"
                      {...register("salary_max")}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    {...register("deadline_date")}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FileText className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold text-gray-900">Additional Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description & Requirements</Label>
                <Textarea
                  placeholder="Enter detailed job description, requirements, and qualifications..."
                  {...register("job_description")}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>

          <button
              disabled={loading}
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
          >
            {loading ? "Loading..." : "Create Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
