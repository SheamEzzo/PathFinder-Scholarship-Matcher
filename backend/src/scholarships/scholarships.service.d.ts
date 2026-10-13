import { Scholarship } from './scholarship.interface';
import { FilterScholarshipsDto } from './dto/filter-scholarships.dto';
export declare class ScholarshipsService {
  private readonly scholarships;
  findAll(): Scholarship[];
  findOne(id: number): Scholarship;
  matchesFilters(
    scholarship: Scholarship,
    filters: FilterScholarshipsDto,
  ): boolean;
  deadlineStatus(scholarship: Scholarship, today?: string): 'open' | 'closed';
}
