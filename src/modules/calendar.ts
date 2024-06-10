import { PcoClient } from '../client';

export class CalendarService {
    private client: PcoClient;

    constructor(client: PcoClient) {
        this.client = client;
    }
}

// Similar modules for Check-ins, Giving, Groups, People, Publishing, Services
