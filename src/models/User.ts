import bcrypt from "bcrypt";

export default class User {
    id?: number;
    email: string;
    password: string;
    salt: string;
    static connection = require('../../knexfile')['development'];
    static database = require('knex')(this.connection);

    constructor(email: string, password: string, salt: string) {
        this.email = email;
        this.password = password;
        this.salt = salt;
    }

    static async validatePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    static getAll() {
        this.database('users').then((res: any) => {
            console.log(res);
        }).catch((e: any) => {
            console.error(e)
        })
    }

    static findOne(email: string): Promise<User | null> {
        return this.database('users').where({email: email}).first()
    }

    static insert(user: User) {
        this.database('users').insert(user)
            .then((res: any) => {
                console.log(res)
            }).catch((e: any) => {
                console.error(e)
            })
    }

    static async checkDuplicateUser(email: string): Promise<boolean> {
        return this.database('users').where({email: email}).then((res: any) => {
            return res.length > 0;
        })
    }
}