// import {
//   BadRequestException,
//   ConflictException,
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import removeFile from 'utils/remove-file';
// import { USER_IMAGE_PATH } from 'utils/user-image-upload.config';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User, UserDocument } from './entities/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel(User.name)
//     private userModel: mongoose.Model<User>,
//   ) {}

//   async findById(userId: string | mongoose.Types.ObjectId) {
//     return await this.userModel.findById(userId);
//   }

//   async findByEmail(email: string) {
//     return await this.userModel.findOne({ email: email });
//   }

//   async findByEmailOrUsername(username: string) {
//     return await this.userModel.findOne({
//       $or: [{ username: username }, { email: username }],
//     });
//   }

//   async create(registerUserDto: CreateUserDto, file: any) {
//     try {
//       const {
//         name,
//         email,
//         username,
//         country,
//         gender,
//         password,
//         confirmPassword,
//       } = registerUserDto;

//       if (password !== confirmPassword) {
//         throw new BadRequestException(
//           'Password and confirmPassword do not match',
//         );
//       }

//       const existingUser = await this.userModel.findOne({ email });
//       if (existingUser) {
//         throw new ConflictException('User already exists');
//       }

//       const newUser = new this.userModel({
//         name,
//         email,
//         username,
//         country,
//         gender,
//         password,
//       });

//       if (file) {
//         console.log('file', file);
//         newUser.image = `${USER_IMAGE_PATH}/${file.filename}`;
//       }

//       await newUser.save();
//       return {
//         message: 'User registered successfully',
//         newUser,
//       };
//     } catch (error) {
//       if (
//         error instanceof ConflictException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       } else {
//         console.log('Error while creating User : ', error);
//         throw new InternalServerErrorException('Something went wrong');
//       }
//     }
//   }

//   async edit(
//     user: UserDocument,
//     updateUserDto: UpdateUserDto,
//     file: Express.Multer.File,
//   ) {
//     try {
//       for (const update in updateUserDto) {
//         user[update] = updateUserDto[update];
//       }
//       if (file) {
//         if (user.image) {
//           removeFile(`public/${user.image}`);
//         }
//         user.image = `${USER_IMAGE_PATH}/${file.filename}`;
//       }
//       await user.save();

//       return {
//         message: 'User profile updated successfully',
//         user,
//       };
//     } catch (error) {
//       console.log('Error while editing user data : ', error);
//       throw new InternalServerErrorException(
//         'Something went wrong while updating user data',
//       );
//     }
//   }
// }


import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Import InjectRepository from @nestjs/typeorm
import { Repository } from 'typeorm'; // Import Repository from TypeORM
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity'; // Import TypeORM User entity
import { UpdateUserDto } from './dto/update-user.dto';
import removeFile from 'utils/remove-file';
import { USER_IMAGE_PATH } from 'utils/user-image-upload.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // Inject TypeORM repository for User entity
    private userRepository: Repository<User>, // Define userRepository as Repository<User>
  ) {}

  async findById(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } }); // Use 'where' option to specify the condition
  }

  async findByEmailOrUsername(usernameOrEmail: string) {
    return await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }], // Use 'where' option to specify the condition
    });
  }

  // async create(registerUserDto: CreateUserDto, file: any) {
  //   try {
  //     const {
  //       name,
  //       email,
  //       username,
  //       country,
  //       gender,
  //       password,
  //       confirmPassword,
  //     } = registerUserDto;

  //     if (password !== confirmPassword) {
  //       throw new BadRequestException(
  //         'Password and confirmPassword do not match',
  //       );
  //     }

  //     const existingUser = await this.userRepository.findOne({ where: { email: email } }); // Use 'where' option to specify the condition
  //     if (existingUser) {
  //       throw new ConflictException('User already exists');
  //     }

  //     const newUser = this.userRepository.create({ // Use 'create' method to create a new entity instance
  //       name,
  //       email,
  //       username,
  //       country,
  //       gender,
  //       password,
  //     });

  //     if (file) {
  //       console.log('file', file);
  //       newUser.image = `${USER_IMAGE_PATH}/${file.filename}`;
  //     }

  //     await this.userRepository.save(newUser); // Use 'save' method to save the new entity
  //     return {
  //       message: 'User registered successfully',
  //       newUser,
  //     };
  //   } catch (error) {
  //     if (
  //       error instanceof ConflictException ||
  //       error instanceof BadRequestException
  //     ) {
  //       throw error;
  //     } else {
  //       console.log('Error while creating User : ', error);
  //       throw new InternalServerErrorException('Something went wrong');
  //     }
  //   }
  // }
  async create(registerUserDto: CreateUserDto, file: any) {
    try {
      const {
        name,
        email,
        username,
        country,
        gender,
        password,
        confirmPassword,
      } = registerUserDto;

      if (password !== confirmPassword) {
        throw new BadRequestException(
          'Password and confirmPassword do not match',
        );
      }

      const existingUser = await this.userRepository.findOne({ where: { email: email } });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const newUser = this.userRepository.create({
        name,
        email,
        username,
        country,
        gender,
        password: hashedPassword, // Save the hashed password
      });

      if (file) {
        console.log('file', file);
        newUser.image = `${USER_IMAGE_PATH}/${file.filename}`;
      }

      await this.userRepository.save(newUser);
      return {
        message: 'User registered successfully',
        newUser,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        console.log('Error while creating User : ', error);
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  async edit(userId: number, updateUserDto: UpdateUserDto, file: any) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } }); // Find the user by userId

      if (!user) {
        throw new NotFoundException('User not found');
      }

      for (const key in updateUserDto) {
        user[key] = updateUserDto[key];
      }

      if (file) {
        if (user.image) {
          removeFile(`public/${user.image}`);
        }
        user.image = `${USER_IMAGE_PATH}/${file.filename}`;
      }

      await this.userRepository.save(user); // Use 'save' method to update the user
      return {
        message: 'User profile updated successfully',
        user,
      };
    } catch (error) {
      console.log('Error while editing user data : ', error);
      throw new InternalServerErrorException(
        'Something went wrong while updating user data',
      );
    }
  }
}
