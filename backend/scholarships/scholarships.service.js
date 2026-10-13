var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
import { Injectable, NotFoundException } from '@nestjs/common';
import { includesValue, normalize } from '../common/types';
import { seedScholarships } from './data/scholarships.seed';
let ScholarshipsService = class ScholarshipsService {
  scholarships = structuredClone(seedScholarships);
  findAll() {
    return this.scholarships;
  }
  findOne(id) {
    const scholarship = this.scholarships.find(
      (candidate) => candidate.id === id,
    );
    if (!scholarship)
      throw new NotFoundException(`Scholarship not found with id ${id}.`);
    return scholarship;
  }
  matchesFilters(scholarship, filters) {
    return (
      (!filters.country ||
        normalize(scholarship.country) === normalize(filters.country)) &&
      (!filters.fieldOfStudy ||
        includesValue(
          scholarship.eligibleFieldsOfStudy,
          filters.fieldOfStudy,
        )) &&
      (!filters.educationLevel ||
        scholarship.requiredEducationLevel === filters.educationLevel) &&
      (!filters.fundingLevel ||
        scholarship.fundingLevel === filters.fundingLevel)
    );
  }
  deadlineStatus(scholarship, today = new Date().toISOString().slice(0, 10)) {
    return scholarship.applicationDeadline < today ? 'closed' : 'open';
  }
};
ScholarshipsService = __decorate([Injectable()], ScholarshipsService);
export { ScholarshipsService };
//# sourceMappingURL=scholarships.service.js.map
