declare module TcHmi {
    module Functions {
        module AutoKB {
            class Obj {
                Keyboard: any;
                Canvas: any;
                Element: any;
                mm: any;
                kid: string;
                cid: string;
                mmid: string;
                Hide: any;
                constructor(UC: any);
            }
            export function AKBElement(Control?: any): Obj;
            export {};
        }
    }
}
