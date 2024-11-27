import { Test, TestingModule } from '@nestjs/testing';
import { ActivityPointsService } from './activityPoints.service'; // Adjust path as needed
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivityPoints } from './ActivityPoints.entity';

describe('ActivityPointsService', () => {
  let service: ActivityPointsService;
  let repository: Repository<ActivityPoints>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityPointsService,
        {
          provide: getRepositoryToken(ActivityPoints),
          useClass: Repository, // Mock the TypeORM repository
        },
      ],
    }).compile();

    service = module.get<ActivityPointsService>(ActivityPointsService);
    repository = module.get<Repository<ActivityPoints>>(
      getRepositoryToken(ActivityPoints),
    );
  });

  describe('findAll', () => {
    it('should return all activity points from the repository', async () => {
      // Mock data matching the ActivityPoints entity
      const mockActivityPoints: ActivityPoints[] = [
        {
          id: 1,
          latitude: new Float32Array([49.2827]),
          longitude: new Float32Array([-123.1207]),
        },
        {
          id: 2,
          latitude: new Float32Array([40.7128]),
          longitude: new Float32Array([-74.006]),
        },
      ];

      // Mock the `find` method
      jest.spyOn(repository, 'find').mockResolvedValue(mockActivityPoints);

      // Call the `findAll` method
      const result = await service.findAll();

      // Assertions
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockActivityPoints);
    });
  });

  describe('create', () => {
    it('should successfully create and save activity points when valid data is provided', async () => {
      const mockActivityPoints: ActivityPoints = {
        id: 1,
        latitude: new Float32Array([49.2827]),
        longitude: new Float32Array([-123.1207]),
      };

      // Mock the `create` and `save` methods
      jest.spyOn(repository, 'create').mockReturnValue(mockActivityPoints);
      jest.spyOn(repository, 'save').mockResolvedValue(mockActivityPoints);

      // Call the `create` method
      const result = await service.create(mockActivityPoints);

      // Assertions
      expect(repository.create).toHaveBeenCalledWith(mockActivityPoints);
      expect(repository.save).toHaveBeenCalledWith(mockActivityPoints);
      expect(result).toEqual(mockActivityPoints);
    });

    it('should log an error and return undefined when latitude is missing', async () => {
      const mockActivityPoints = {
        id: 1,
        latitude: undefined,
        longitude: new Float32Array([-123.1207]),
      } as unknown as ActivityPoints;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Call the `create` method
      const result = await service.create(mockActivityPoints);

      // Assertions
      expect(consoleSpy).toHaveBeenCalledWith('Latitude must be included');
      expect(result).toBeUndefined();

      // Clean up
      consoleSpy.mockRestore();
    });

    it('should log an error and return undefined when longitude is missing', async () => {
      const mockActivityPoints = {
        id: 1,
        latitude: new Float32Array([49.2827]),
        longitude: undefined,
      } as unknown as ActivityPoints;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Call the `create` method
      const result = await service.create(mockActivityPoints);

      // Assertions
      expect(consoleSpy).toHaveBeenCalledWith('Longitude must be included');
      expect(result).toBeUndefined();

      // Clean up
      consoleSpy.mockRestore();
    });
  });
});
