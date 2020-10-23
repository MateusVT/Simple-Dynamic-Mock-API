import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "Routes" })
export class Route {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    url!: string;

    @Column()
    method!: string;

    @Column()
    httpStatus!: number;

    @Column({
        length: 100,
    })
    data!: string;

    @Column()
    responseStructure: "ArrayObject" | "Object";

    @Column({ nullable: true })
    searchKey?: string;

    constructor(url: string, method: string, httpStatus: number, data: {} | any[], responseStructure: "ArrayObject" | "Object", searchKey?: string) {
        this.url = url;
        this.method = method;
        this.httpStatus = httpStatus;
        this.data = JSON.stringify(data);
        this.responseStructure = responseStructure;
        this.searchKey = searchKey;
    }
}

