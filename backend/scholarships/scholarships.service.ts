import { Injectable, NotFoundException } from '@nestjs/common';
import { includesValue, normalize } from '../common/types';
import { seedScholarships } from './data/scholarships.seed';
import { Scholarship } from './scholarship.interface';
import { FilterScholarshipsDto } from './dto/filter-scholarships.dto';

@Injectable()
export class ScholarshipsService {
  private readonly scholarships: Scholarship[] = structuredClone(seedScholarships);

  findAll(): Scholarship[] { return this.scholarships; }

  findOne(id: number): Scholarship {
    const scholarship = this.scholarships.find((candidate) => candidate.id === id);
    if (!scholarship) throw new NotFoundException(`Scholarship not found with id ${id}.`);
    return scholarship;
  }

  matchesFilters(scholarship: Scholarship, filters: FilterScholarshipsDto): boolean {
    return (!filters.country || normalize(scholarship.country) === normalize(filters.country))
      && (!filters.fieldOfStudy || includesValue(scholarship.eligibleFieldsOfStudy, filters.fieldOfStudy))
      && (!filters.educationLevel || scholarship.requiredEducationLevel === filters.educationLevel)
      && (!filters.fundingLevel || scholarship.fundingLevel === filters.fundingLevel);
  }

  deadlineStatus(scholarship: Scholarship, today = new Date().toISOString().slice(0, 10)): 'open' | 'closed' {
    // A date-only deadline is inclusive through the end of that UTC calendar day.
    return scholarship.applicationDeadline < today ? 'closed' : 'open';
  }
}
