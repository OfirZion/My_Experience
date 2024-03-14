


import { UserAuthT } from './@Types';
declare module 'express-serve-static-core' {

    interface Request  {
        user?: UserAuthT;
    }
}