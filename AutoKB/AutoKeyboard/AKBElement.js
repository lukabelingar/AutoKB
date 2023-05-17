var TcHmi;
(function (TcHmi) {
    let Functions;
    (function (Functions) {
        let AutoKB;
        (function (AutoKB) {
            class Obj {
                constructor(UC) {
                    //UC = UC.getParent().getElement();//$(this.Element);// ('[data-tchmi-target-user-control="AKB.usercontrol"],[data-tchmi-target-user-control*="/AKB.usercontrol"]');
                    this.Element = UC;
                    let Keyboard = UC.find("[data-tchmi-type='TcHmi.Controls.Beckhoff.TcHmiKeyboard']");
                    if (!(Keyboard && Keyboard.length))
                        throw new Error('TcHmiKeyboard element not found.');
                    let minmax = UC.find("[data-tchmi-type^='TcHmi.Controls.Beckhoff.TcHmiText']");
                    if (minmax && minmax.length) {
                        this.mmid = minmax[0].id;
                        this.mm = TcHmi.Controls.get(this.mmid);
                    }
                    this.kid = Keyboard[0].id;
                    this.cid = UC[0].id;
                    //in order for this to be accessible, tsconfig.tpl.json has to be edited, add package reference to "include" section:
                    //    "$(Beckhoff.TwinCAT.HMI.Controls).InstallPath/TcHmiKeyboard/TcHmiKeyboard.d.ts"
                    //this.Keyboard = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiKeyboard>(this.kid);
                    //alternatively, use get without type declaration
                    this.Keyboard = TcHmi.Controls.get(this.kid);
                    this.Canvas = TcHmi.Controls.get(this.cid);
                    //that's a lambda and is here because passing methods with "this" references to eventprovider doesn't bide well.
                    this.Hide = () => {
                        TcHmi.TopMostLayer.removeEx(this.Element);
                        this.Canvas.setVisibility('Collapsed');
                    };
                    TcHmi.EventProvider.register(`${this.kid}.onIndirectInputAccepted`, this.Hide);
                    TcHmi.EventProvider.register(`${this.kid}.onIndirectInputCanceled`, this.Hide);
                    this.Hide();
                }
            }
            var objs;
            function AKBElement(Control) {
                if (Control) {
                    //objs = new Obj(Control);
                    var UC = Control.getParent().getElement();
                    TcHmi.EventProvider.register(`${UC[0].id}.onAttached`, (e, d) => {
                        e.destroy();
                        objs = new Obj(UC);
                    });
                }
                return objs;
            }
            AutoKB.AKBElement = AKBElement;
        })(AutoKB = Functions.AutoKB || (Functions.AutoKB = {}));
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi || (TcHmi = {}));
TcHmi.Functions.registerFunctionEx('AKBElement', 'TcHmi.Functions.AutoKB', TcHmi.Functions.AutoKB.AKBElement);
//# sourceMappingURL=AKBElement.js.map