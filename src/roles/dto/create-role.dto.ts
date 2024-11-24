import { stringConst } from "@/constants/auth";
import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @IsNotEmpty({ message: stringConst.requireMessage("name") })
  name: string;

  @IsNotEmpty({ message: stringConst.requireMessage("description") })
  description: string;

  @IsNotEmpty({ message: stringConst.requireMessage("isActive") })
  isActive: boolean;

  @IsNotEmpty({ message: stringConst.requireMessage("permission") })
  @IsArray()
  @IsMongoId({ each: true })
  permission: mongoose.Schema.Types.ObjectId[];
}
