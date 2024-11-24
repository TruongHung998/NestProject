import { ResponseMessage, User } from "@/decorator/customize";
import { IUser } from "@/user/users.interface";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobsService } from "./jobs.service";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage("Create")
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @ResponseMessage("Get List")
  findAll(@Query() qs: string) {
    return this.jobsService.findAll(qs);
  }

  @Get(":id")
  @ResponseMessage("Get By Id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update By Id")
  update(
    @Param("id") id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser
  ) {
    console.log(updateJobDto, 'updateJobDto');
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete By Id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
