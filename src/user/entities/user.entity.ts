// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';
// import * as bcrypt from 'bcrypt';
// import { BadRequestException } from '@nestjs/common';

// export enum Gender {
//   MALE = 'Male',
//   FEMALE = 'Female',
//   OTHER = 'Other',
// }

// export type UserDocument = HydratedDocument<User>;

// @Schema({
//   timestamps: true,
// })
// export class User {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true, unique: true })
//   username: string;

//   @Prop()
//   country: string;

//   @Prop({ required: true })
//   gender: Gender;

//   @Prop({ default: null })
//   image: string;

//   @Prop({ required: true })
//   password: string;
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const hashPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashPassword;
//   }
//   next();
// });

// UserSchema.post('save', async function (error, doc, next) {
//   if (error.name === 'MongoServerError' && error.code === 11000) {
//     throw new BadRequestException('Username or email already exists');
//   } else {
//     next();
//   }
// });


import { Entity, Column, PrimaryGeneratedColumn, Repository, EntityRepository } from 'typeorm';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;
}

// @EntityRepository(User)
// export class UserSchema extends Repository<User> {
//   async createUser(userDto: CreateUserDto): Promise<User> {
//     const { name, username, email, password, country, gender } = userDto;

//     const newUser = new User();
//     newUser.name = name;
//     newUser.username = username;
//     newUser.email = email;
//     newUser.password = await bcrypt.hash(password, 10);
//     newUser.country = country;
//     newUser.gender = gender;

//     try {
//       return await newUser.save();
//     } catch (error) {
//       if (error.code === '23505') { // Unique violation error code
//         throw new BadRequestException('Username or email already exists');
//       } else {
//         throw error;
//       }
//     }
//   }
// }
