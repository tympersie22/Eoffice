const app = angular.module('app', ['ui.select', 'ngSanitize', 'ui.bootstrap']);

enum Reasons {
    Annual,
    Personal,
    Compassionate,
    Parental
}

class ReasonDescriptions {

    public static Reasons = [{ id: 0, desc: "Annual" }, { id: 1, desc: "Personal" }, { id: 2, desc: "Compassionate" }, { id: 3, desc: "Parental" }];
    
}

enum ApprovalStatus {
    Pending,
    Approved,
    Denied
}

class ApprovalStatusDecriptions {

   public static ApprovalStatus = ["Pending", "Approved", "Denied"];

}

class LeaveItem {

    startDate: Date;
    endDate: Date;
    reason: Reasons;
    comment: string;
    status: ApprovalStatus;

}

class Employee {

    firstName: string;
    surname: string;

}

class LeaveController {

    public leaveItems: LeaveItem[];
    public employee: Employee;
    public newLeaveItem: LeaveItem;
    public dateFormat: string = "dd/MM/yyyy";
    public endDateOpened: boolean = false;
    public startDateOpened: boolean = false;
    public newItemIsError: boolean = false;

    constructor() {
        this.load();
        this.resetNewLeaveItem();
    }
    
    //define the options for the start date popup
    public dateOptionsStart = {
        maxDate: new Date(2020, 1, 1),
        startingDay: 1
    };

    //define the options for the end date popup
    public dateOptionsEnd = {
        minDate: new Date(),
        maxDate: new Date(2020, 1, 1),
        startingDay: 1
    };

    //open the end date popup
    public openEndDate() {
        this.endDateOpened = true;
    }

    //open the start date popup
    public openStartDate() {
        this.startDateOpened = true;
    }

    //format the dates to human readable text. Its a method to enable future refactoring 
    public formatDate(date: Date): string {
        return date.toDateString();
    }

    //derive the employees full name from the employee object
    public get fullName(): string {
        return `${this.employee.firstName} ${this.employee.surname}`;
    }

    //get an array of all the Reasons enum values
    public get reasons(): any[] {
        return ReasonDescriptions.Reasons;
    }

    //get an array of all the ApporovalStatus enum values
    public get statuses(): string[] {
        return ApprovalStatusDecriptions.ApprovalStatus;
    }

    //when the date changes change the start date and and date limits to match
    public dateChanged() {
        this.dateOptionsEnd.minDate =  this.newLeaveItem.startDate || new Date();
        this.dateOptionsStart.maxDate =  this.newLeaveItem.endDate || new Date(2020, 1, 1);
    }

    //add to the list of leave applications. If this was real app, 
    //this method would post to the server and then pull down a new list
    public addLeaveApplication() {
        this.newItemIsError = false;
        if (this.newLeaveItemIsValid()) {
            // push to the server here, if this were real
            this.newLeaveItem.status = ApprovalStatus.Pending;
            this.leaveItems.push(angular.copy(this.newLeaveItem));
            this.resetNewLeaveItem();
        } else {
            this.newItemIsError = true;
        }
    }

    //load all the leave applications from the server - justa demo in this case
    private load() {
        // this is where you would load the employees leave applications from the server
        this.employee = { firstName: "Jane", surname: "Everywoman" };
        this.leaveItems = [
            {
                startDate: new Date(2017, 4, 10),
                endDate: new Date(2017, 4, 14),
                reason: Reasons.Personal,
                comment: "I am the most sick",
                status: ApprovalStatus.Approved
            }];
    }

    //reset the the item to default values
    private resetNewLeaveItem() {
        this.newLeaveItem = {
            endDate: null,
            startDate: null,
            reason: null,
            status: null,
            comment: null
        };
    }

    //validate the new leave item fields
    private newLeaveItemIsValid(): boolean {
        return !!this.newLeaveItem.endDate &&
            !!this.newLeaveItem.startDate &&
            !!this.newLeaveItem.reason &&
            this.newLeaveItem.startDate <= this.newLeaveItem.endDate
    }


}

app.controller('LeaveController', LeaveController);