export type FX = ((a: any)=>any);
export interface ITask {
    $active?: boolean;
    list?: ITask[]|null;
    taskId: string;
    payload: any;
    get order(): number;
    set active(activeStatus: boolean);
    get active(): boolean;
    set focus(activeStatus: boolean);
    get focus(): boolean;
    render?(): any;
    takeAction?(): boolean|void;
    addSelfToList(list?: ITask[]|null, doFocus?: boolean): ITask;
    removeFromList(): ITask;
}

export interface ITaskOptions {
    active?: boolean;
    focus?: boolean;
    order?: number;
    title?: string;
    icon?: string;
    payload?: any;
    action?: any;
    render?: any;
}
