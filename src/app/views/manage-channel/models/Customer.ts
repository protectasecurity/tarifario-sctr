export class Customer {
    id: string;
    description: string;

    constructor(data: any) {
        this.id = data.id;
        this.description = data.name;
    }
    static mapFromResponse(data: any): Customer {
        return new Customer(data);
    }
}