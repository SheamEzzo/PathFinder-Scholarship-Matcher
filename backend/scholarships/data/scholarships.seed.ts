import { EducationLevel, FundingLevel } from '../../common/types';
import { Scholarship } from '../scholarship.interface';

// Fictional, realistic teaching data. Dates intentionally remain fixed.
export const seedScholarships: Scholarship[] = [
  {
    "id": 1,
    "title": "Germany Computing Masters",
    "country": "Germany",
    "institution": "Berlin Institute of Technology",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Software Engineering"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": {
      "max": 35
    },
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-03-15",
    "description": "Illustrative master scholarship for Computer Science, Software Engineering at Berlin Institute of Technology. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 2,
    "title": "Canada Digital Futures",
    "country": "Canada",
    "institution": "Ontario Research University",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Data Science"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": null,
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-04-15",
    "description": "Illustrative master scholarship for Computer Science, Data Science at Ontario Research University. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 3,
    "title": "France Engineering Excellence",
    "country": "France",
    "institution": "Lyon Institute of Engineering",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Engineering"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "French"
    ],
    "ageRestriction": {
      "max": 30
    },
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-02-01",
    "description": "Illustrative master scholarship for Computer Science, Engineering at Lyon Institute of Engineering. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 4,
    "title": "Germany Doctoral Research",
    "country": "Germany",
    "institution": "Munich Research Institute",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Engineering"
    ],
    "studyLevel": EducationLevel.PHD,
    "requiredEducationLevel": EducationLevel.MASTER,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": null,
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-02-10",
    "description": "Illustrative phd scholarship for Computer Science, Engineering at Munich Research Institute. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 5,
    "title": "Italy Design Scholars",
    "country": "Italy",
    "institution": "Florence School of Design",
    "eligibleFieldsOfStudy": [
      "Design",
      "Architecture"
    ],
    "studyLevel": EducationLevel.BACHELOR,
    "requiredEducationLevel": EducationLevel.HIGH_SCHOOL,
    "languageRequirements": [
      "Italian"
    ],
    "ageRestriction": {
      "max": 25
    },
    "fundingLevel": FundingLevel.TUITION_ONLY,
    "estimatedAnnualCost": 10000,
    "applicationDeadline": "2027-05-01",
    "description": "Illustrative bachelor scholarship for Design, Architecture at Florence School of Design. Estimated remaining student cost: USD 10,000 per year. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 6,
    "title": "T\u00fcrkiye Undergraduate Science",
    "country": "T\u00fcrkiye",
    "institution": "Ankara Science University",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Engineering",
      "Biology"
    ],
    "studyLevel": EducationLevel.BACHELOR,
    "requiredEducationLevel": EducationLevel.HIGH_SCHOOL,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": {
      "max": 24
    },
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-03-01",
    "description": "Illustrative bachelor scholarship for Computer Science, Engineering, Biology at Ankara Science University. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 7,
    "title": "Canada Applied Computing",
    "country": "Canada",
    "institution": "Vancouver Technical University",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Software Engineering"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": null,
    "fundingLevel": FundingLevel.PARTIALLY_FUNDED,
    "estimatedAnnualCost": 8000,
    "applicationDeadline": "2027-03-15",
    "description": "Illustrative master scholarship for Computer Science, Software Engineering at Vancouver Technical University. Estimated remaining student cost: USD 8,000 per year. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 8,
    "title": "Germany Software Innovation",
    "country": "Germany",
    "institution": "Hamburg Institute of Technology",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Software Engineering"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": null,
    "fundingLevel": FundingLevel.TUITION_ONLY,
    "estimatedAnnualCost": 14000,
    "applicationDeadline": "2027-03-15",
    "description": "Illustrative master scholarship for Computer Science, Software Engineering at Hamburg Institute of Technology. Estimated remaining student cost: USD 14,000 per year. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 9,
    "title": "Japan Robotics Research",
    "country": "Japan",
    "institution": "Osaka Science Institute",
    "eligibleFieldsOfStudy": [
      "Engineering",
      "Computer Science"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English",
      "Japanese"
    ],
    "ageRestriction": {
      "max": 35
    },
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-06-01",
    "description": "Illustrative master scholarship for Engineering, Computer Science at Osaka Science Institute. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 10,
    "title": "UK Business Leaders",
    "country": "United Kingdom",
    "institution": "Bristol Business Institute",
    "eligibleFieldsOfStudy": [
      "Business",
      "Economics"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": null,
    "fundingLevel": FundingLevel.PARTIALLY_FUNDED,
    "estimatedAnnualCost": 15000,
    "applicationDeadline": "2027-04-01",
    "description": "Illustrative master scholarship for Business, Economics at Bristol Business Institute. Estimated remaining student cost: USD 15,000 per year. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 11,
    "title": "France Arts Access",
    "country": "France",
    "institution": "Paris Academy of Arts",
    "eligibleFieldsOfStudy": [
      "Arts",
      "Design"
    ],
    "studyLevel": EducationLevel.BACHELOR,
    "requiredEducationLevel": EducationLevel.HIGH_SCHOOL,
    "languageRequirements": [
      "French"
    ],
    "ageRestriction": {
      "max": 28
    },
    "fundingLevel": FundingLevel.PARTIALLY_FUNDED,
    "estimatedAnnualCost": 6000,
    "applicationDeadline": "2027-05-15",
    "description": "Illustrative bachelor scholarship for Arts, Design at Paris Academy of Arts. Estimated remaining student cost: USD 6,000 per year. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 12,
    "title": "T\u00fcrkiye Public Health Research",
    "country": "T\u00fcrkiye",
    "institution": "Istanbul Health Institute",
    "eligibleFieldsOfStudy": [
      "Medicine",
      "Public Health",
      "Biology"
    ],
    "studyLevel": EducationLevel.PHD,
    "requiredEducationLevel": EducationLevel.MASTER,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": {
      "max": 40
    },
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-07-01",
    "description": "Illustrative phd scholarship for Medicine, Public Health, Biology at Istanbul Health Institute. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 13,
    "title": "Italy Data Science Masters",
    "country": "Italy",
    "institution": "Milan Technology Institute",
    "eligibleFieldsOfStudy": [
      "Computer Science",
      "Mathematics",
      "Data Science"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": null,
    "fundingLevel": FundingLevel.PARTIALLY_FUNDED,
    "estimatedAnnualCost": 5000,
    "applicationDeadline": "2027-04-20",
    "description": "Illustrative master scholarship for Computer Science, Mathematics, Data Science at Milan Technology Institute. Estimated remaining student cost: USD 5,000 per year. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 14,
    "title": "Japan Global Science",
    "country": "Japan",
    "institution": "Kyoto International College",
    "eligibleFieldsOfStudy": [
      "Physics",
      "Mathematics",
      "Engineering"
    ],
    "studyLevel": EducationLevel.BACHELOR,
    "requiredEducationLevel": EducationLevel.HIGH_SCHOOL,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": {
      "max": 25
    },
    "fundingLevel": FundingLevel.TUITION_ONLY,
    "estimatedAnnualCost": 12000,
    "applicationDeadline": "2027-06-15",
    "description": "Illustrative bachelor scholarship for Physics, Mathematics, Engineering at Kyoto International College. Estimated remaining student cost: USD 12,000 per year. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 15,
    "title": "Canada Environmental Doctorate",
    "country": "Canada",
    "institution": "Quebec Environmental Institute",
    "eligibleFieldsOfStudy": [
      "Biology",
      "Environmental Science"
    ],
    "studyLevel": EducationLevel.PHD,
    "requiredEducationLevel": EducationLevel.MASTER,
    "languageRequirements": [
      "English",
      "French"
    ],
    "ageRestriction": null,
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2027-05-30",
    "description": "Illustrative phd scholarship for Biology, Environmental Science at Quebec Environmental Institute. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  },
  {
    "id": 16,
    "title": "Germany Computing Archive",
    "country": "Germany",
    "institution": "Berlin Institute of Technology",
    "eligibleFieldsOfStudy": [
      "Computer Science"
    ],
    "studyLevel": EducationLevel.MASTER,
    "requiredEducationLevel": EducationLevel.BACHELOR,
    "languageRequirements": [
      "English"
    ],
    "ageRestriction": {
      "max": 35
    },
    "fundingLevel": FundingLevel.FULLY_FUNDED,
    "estimatedAnnualCost": 0,
    "applicationDeadline": "2020-01-15",
    "description": "Illustrative master scholarship for Computer Science at Berlin Institute of Technology. Tuition and estimated living costs are covered. Fictional teaching data, not an actual scholarship offer."
  }
];
