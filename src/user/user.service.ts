import { BadRequestException, Injectable, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp from "api-query-params";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { RegisterUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { IUser } from "./users.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) {}

  checkMatch(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }

  getHashPassword(password) {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  async create(RegisterUserDto: RegisterUserDto, user: IUser) {
    console.log(user, 'user')
    const { name, email, password, age, gender, address } = RegisterUserDto;
    const _hash = this.getHashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`);
    }
    const _user = await this.userModel.create({
      name,
      email,
      age,
      gender,
      address,
      password: _hash,
      role: "USER",
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return _user;
  }
  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    const _hash = this.getHashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`);
    }
    const _user = await this.userModel.create({
      name,
      email,
      age,
      gender,
      address,
      password: _hash,
      role: "USER",
    });
    return _user;
  }

  async findAll(@Query() qs: string) {
    try {
      const { filter, projection, population, limit } = aqp(qs);
      const { page } = filter;
      let offset = (+page - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;
      delete filter.page;
      const totalItems = (await this.userModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
      const result = await this.userModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        // @ts-ignore: Unreachable code error .sort(sort)
        .populate(population)
        .exec();
      return {
        length: result.length,
        totalPages,
        result,
      };
    } catch (e) {
      return e;
    }
  }

  findOne(id: number | string) {
    if (this.checkMatch(id)) {
      const _find = this.userModel.findById(id);
      return _find;
    } else {
      return {
        message: "Không tìm thấy người dùng",
      };
    }
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    try {
      if (this.checkMatch(updateUserDto._id)) {
        return await this.userModel.updateOne(
          { _id: updateUserDto._id },
          {
            ...updateUserDto,
            updatedBy: {
              _id: user._id,
              email: user.email,
            }
          }
        );
      } else {
        return {
          message: "Không tìm thấy người dùng",
        };
      }
    } catch (e) {
      return e;
    }
  }

  async remove(id: string) {
    try {
      if (this.checkMatch(id)) {
        return await this.userModel.softDelete({ _id: id });
      } else {
        return {
          message: "Không tìm thấy người dùng",
        };
      }
    } catch (e) {
      return e;
    }
  }
  findByEmail(email: string) {
    console.log(email, 'email');
    const _find = this.userModel.findOne({ email });
    return _find;
  }
  checkPassword(pass: string, userPassword: string): Boolean {
    return compareSync(pass, userPassword);
  }
}
