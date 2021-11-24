import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  Competition as CompetitionModel,
  Submission as SubmissionModel,
} from '@prisma/client';
import { getSubmissionRating } from 'src/submissionRating';
import { sortVotes } from 'src/sortVotes';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getAllCompetitions(): Promise<CompetitionModel[]> {
    return this.prismaService.competition.findMany();
  }

  @Get(':id')
  async getCompetitionById(@Param('id') id: string): Promise<CompetitionModel> {
    return this.prismaService.competition.findUnique({
      where: { id: Number(id) },
    });
  }

  @Put(':id')
  async updateCompetition(
    @Param('id') id: string,
    @Body()
    competitionData: {
      title: string;
      description: string;
      startDate: number[];
      endDate: number[];
    },
  ): Promise<CompetitionModel> {
    const { title, description, startDate, endDate } = competitionData;
    return this.prismaService.competition.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        startDate: new Date(startDate[0], startDate[1], startDate[2]),
        endDate: new Date(endDate[0], endDate[1], endDate[2]),
      },
    });
  }

  @Post()
  async createCompetition(
    @Body()
    competitionData: {
      title: string;
      description: string;
      userId: number;
      startDate: number[];
      endDate: number[];
    },
  ): Promise<CompetitionModel | object> {
    const { title, description, userId, startDate, endDate } = competitionData;

    const isSuperUser: { superuser: boolean } =
      await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          superuser: true,
        },
      });

    if (isSuperUser.superuser) {
      return this.prismaService.competition.create({
        data: {
          title,
          description,
          creator: {
            connect: { id: userId },
          },
          startDate: new Date(startDate[0], startDate[1], startDate[2]),
          endDate: new Date(endDate[0], endDate[1], endDate[2]),
        },
      });
    } else {
      return {
        errorCode: '',
        info: 'This user is not authorised to create a new competition.',
      };
    }
  }

  // @Get(':id/submissions')
  // async getSubmissionsByCompetition(@Param('id') id: string): Promise<object> {
  //   const submissions = await this.prismaService.submission.findMany({
  //     where: {
  //       competitionId: Number(id),
  //     },
  //     orderBy: [
  //       {
  //         createdAt: 'desc',
  //       },
  //     ],
  //   });
  //   for (let i = 0; i < submissions.length; i++) {
  //     if (submissions[i].rating !== 0) {
  //       const rating = await getSubmissionRating(submissions[i].id.toString());
  //       Object.assign(submissions[i], { rating: rating });
  //     }
  //   }
  //   return submissions;
  // }

  @Get(':id/submissions')
  async getSubmissionsByCompetition(
    @Param('id') id: string,
    @Body()
    settings: {
      skip: number;
      take: number;
      order: string;
    },
  ): Promise<object> {
    const { skip, take, order } = settings;
    const submissions = await this.prismaService.submission.findMany({
      skip,
      take,
      where: {
        competitionId: Number(id),
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    for (let i = 0; i < submissions.length; i++) {
      if (submissions[i].rating !== 0) {
        const rating = await getSubmissionRating(submissions[i].id.toString());
        Object.assign(submissions[i], { rating: rating });
      }
    }

    if (order === 'votes') {
      return sortVotes(submissions);
    } else {
      return submissions;
    }
  }

  //todo add get request to get the winners
  //todo add get request to sort after ratings

  @Delete(':id')
  async deleteCompetition(
    @Param('id') id: string,
  ): Promise<[Object, CompetitionModel]> {
    const deleteSubmissions = this.prismaService.submission.deleteMany({
      where: {
        competitionId: Number(id),
      },
    });

    const deleteCompetition = this.prismaService.competition.delete({
      where: {
        id: Number(id),
      },
    });

    return await this.prismaService.$transaction([
      deleteSubmissions,
      deleteCompetition,
    ]);
  }
}
