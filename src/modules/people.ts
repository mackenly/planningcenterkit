import { PcoClient } from "../client";

interface PersonAttributes {
    given_name: string;
    first_name: string;
    nickname: string;
    middle_name: string;
    last_name: string;
    birthdate: string;
    anniversary: string;
    grade: number;
    child: boolean;
    graduation_year: number;
    site_administrator: boolean;
    accounting_administrator: boolean;
    people_permissions: string;
    gender: string;
    membership: string;
    inactivated_at: string;
    status: string;
    medical_notes: string;
    mfa_configured: boolean;
    created_at: string;
    updated_at: string;
    avatar: string;
    name: string;
    demographic_avatar_url: string;
    directory_status: string;
    can_create_forms: boolean;
    can_email_lists: boolean;
    passed_background_check: boolean;
    school_type: string;
    remote_id: number;
    directory_shared_info: Record<string, unknown>;
}

interface RelationshipData {
    type: string;
    id: string;
}

interface PersonRelationships {
    primary_campus: {
        data: RelationshipData;
    };
    gender: {
        data: RelationshipData;
    };
    [key: string]: {
        data: RelationshipData;
    };
}

interface Person {
    type: string;
    id: string;
    attributes: PersonAttributes;
    relationships: PersonRelationships;
}

interface PeopleResponse {
    data: Person[];
    included?: Person[];
    meta: {
        total_count: number;
    };
}

enum CanInclude {
    addresses = 'addresses',
    emails = 'emails',
    field_data = 'field_data',
    households = 'households',
    inactive_reason = 'inactive_reason',
    marital_status = 'marital_status',
    name_prefix = 'name_prefix',
    name_suffix = 'name_suffix',
    organization = 'organization',
    person_apps = 'person_apps',
    phone_numbers = 'phone_numbers',
    platform_notifications = 'platform_notifications',
    primary_campus = 'primary_campus',
    school = 'school',
    social_profiles = 'social_profiles',
}


export class PcoPeople extends PcoClient {
    public async getPerson(): Promise<PeopleResponse> {
        return await this.request(`/people/v2/people${this.buildQuery()}`) as PeopleResponse;
    }
}