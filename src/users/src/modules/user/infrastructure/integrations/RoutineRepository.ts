/* eslint-disable @typescript-eslint/require-await */
import axios from "axios";

import Routine from "@user/domain/Routine";
import RoutineDao from "@user/infrastructure/integrations/RoutineDao";

// TODO: this could be moved to another place to be reused
const validateStatus = (status: number): boolean => status >= 200 && status <= 499;

const api = axios.create({ validateStatus });

interface ConfirmationResponse {
    success: boolean;
}

interface BaseApiResponse<T> extends ConfirmationResponse {
    data: T;
    error?: string | Array<string>;
}

class RoutineRepository {
    constructor(private readonly routineIntegrationUrl: string) {}

    public async getRoutineByUserId(userId: string): Promise<Routine | null> {
        try {
            const { data } = await api.get<BaseApiResponse<RoutineDao>>(
                `${this.routineIntegrationUrl}/api/v1/routines/user/${userId}`
            );

            if (!data.success) {
                return null;
            }

            const routineModel: Routine = await RoutineDao.toModel({ ...data.data });

            return routineModel;
        } catch (error: any) {
            return null;
        }
    }
}

export default RoutineRepository;
