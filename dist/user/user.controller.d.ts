import { UserService } from './user.service';
import { User } from 'generated/prisma';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(user: User): Promise<{
        name: string;
        email: string;
    }[]>;
}
