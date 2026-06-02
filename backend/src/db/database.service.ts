import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
    
    getUsers() {
        return"database service";
    }
}
