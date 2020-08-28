import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
 
@Entity()
export class Todo {
 
    @PrimaryGeneratedColumn('increment')
    id!: number;
 
    @Column({
        length: 100,
    })
    Task_name!: string;
    
 
    @Column("text")
    description!: string;
 
    
    @Column()
    isCompleted!: boolean;
}