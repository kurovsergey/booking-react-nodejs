import { OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class SeederService implements OnApplicationBootstrap {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    onApplicationBootstrap(): Promise<void>;
    seed(): Promise<void>;
}
