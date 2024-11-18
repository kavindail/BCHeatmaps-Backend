import { Test, TestingModule } from '@nestjs/testing';
import { ActivityPointsController } from './ActivityPoints.controller';
import { ActivityPointsService } from './ActivityPoints.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { ActivityPoints } from './ActivityPoints.entity';
import * as fs from 'fs';

jest.mock('fs');

describe('ActivityPointsController', () => {
    let controller: ActivityPointsController;
    let service: ActivityPointsService;
    let mockResponse: Partial<Response>;

    beforeEach(async () => {
        const mockActivityPointsService = {
            findAll: jest.fn(),
            create: jest.fn(),
            getActivityFromJson: jest.fn(),
            clearDatabase: jest.fn(),
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActivityPointsController],
            providers: [
                { provide: ActivityPointsService, useValue: mockActivityPointsService },
            ],
        }).compile();

        controller = module.get<ActivityPointsController>(ActivityPointsController);
        service = module.get<ActivityPointsService>(ActivityPointsService);
    });

    it('should return all activity points with status 200', async () => {
        const mockActivityPoints = [
            { id: 1, latitude: new Float32Array([49.2827]), longitude: new Float32Array([-123.1207]) },
            { id: 2, latitude: new Float32Array([40.7128]), longitude: new Float32Array([-74.006]) },
        ];
        (service.findAll as jest.Mock).mockResolvedValue(mockActivityPoints);

        await controller.getActivityPoints(mockResponse as Response);

        expect(service.findAll).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
        expect(mockResponse.json).toHaveBeenCalledWith(mockActivityPoints);
    });

    it('should return 201 and the created activity point when successful', async () => {
        const mockActivityPoint = new ActivityPoints(new Float32Array([49.2827]), new Float32Array([-123.1207]));
        const savedActivityPoint = { ...mockActivityPoint, id: 1 };

        (service.create as jest.Mock).mockResolvedValue(savedActivityPoint);

        await controller.createActivityPoints(mockActivityPoint, mockResponse as Response);

        expect(service.create).toHaveBeenCalledWith(mockActivityPoint);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
        expect(mockResponse.json).toHaveBeenCalledWith(savedActivityPoint);
    });

    it('should return 400 if latitude or longitude is missing', async () => {
        const invalidActivityPoint = new ActivityPoints(undefined, new Float32Array([-123.1207]));

        (service.create as jest.Mock).mockResolvedValue(undefined);

        await controller.createActivityPoints(invalidActivityPoint, mockResponse as Response);

        expect(service.create).toHaveBeenCalledWith(invalidActivityPoint);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Failed to save activity points to database' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const mockActivityPoint = new ActivityPoints(new Float32Array([49.2827]), new Float32Array([-123.1207]));

        (service.create as jest.Mock).mockRejectedValue(new Error('Database error'));

        await controller.createActivityPoints(mockActivityPoint, mockResponse as Response);

        expect(service.create).toHaveBeenCalledWith(mockActivityPoint);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    it('should return 201 and the full JSON when successful', async () => {
        const mockJson = {
            boards: [
                {
                    classes: [
                        {
                            name: 'residential',
                            areas: [
                                {
                                    cities: [
                                        {
                                            state: 'Ontario',
                                            activeCount: 1,
                                            location: { lat: 45.4215, lng: -75.6972 },
                                            neighborhoods: [
                                                { location: { lat: 45.4215, lng: -75.6972 } },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(mockJson));
        (service.create as jest.Mock).mockResolvedValue(undefined);

        await controller.recalculateJsonActivityPoints(mockResponse as Response);

        expect(service.getActivityFromJson).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });

    it('should return 201 if the database is cleared successfully', async () => {
        // make the mock value to be true
        (service.clearDatabase as jest.Mock).mockResolvedValue(true);

        await controller.clearPointData(mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
        expect(mockResponse.json).toHaveBeenCalledWith('Sucesfully cleared the database');
    });
});
