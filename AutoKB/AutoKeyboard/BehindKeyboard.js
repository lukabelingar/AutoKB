var TcHmi;
(function (TcHmi) {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    let destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', (e, data) => {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();
        //detects type of input type
        function currentInputType(element) {
            //getting the class of the element
            let cls = element.getAttribute('class');
            if (cls) {
                //ignore disabled stuff and the keyboard
                if (cls.search(/(TcHmi_Controls_Beckhoff_TcHmiKeyboard-template)|(TcHmi_Controls_System_TcHmiControl-disabled)/i) < 0) {
                    if (cls.search(/TcHmi_Controls_Beckhoff_TcHmi(((Input|Textbox|DateTimeInput|TimespanInput)-template-input)|(Datagrid-textbox))/i) >= 0)
                        return element.getAttribute('type') == 'password' ? 'password' : 'text';
                    if (cls.search(/TcHmi_Controls_Beckhoff_TcHmiDatagrid-password-input/i) >= 0)
                        return 'password';
                    if (cls.search(/TcHmi_Controls_Beckhoff_TcHmi(NumericInput-template|Datagrid-numeric)-input/i) >= 0)
                        return 'number';
                }
            }
            return null;
        }
        //checks whether argument is a symbol and in that case reads it
        let rs = (e) => e instanceof TcHmi.Symbol ? e.read() : e;
        //when not in designer and also checks whether it's a system with built-in virtual keyboard
        if (TCHMI_DESIGNER !== true && navigator.userAgent.search(/Android|BlackBerry|iPhone|iP[ao]d|Opera Mini|IEMobile/i) < 0) {
            let namespace = 'click.auto.kb';
            function onclick() {
                let objs = TcHmi.Functions.AutoKB.AKBElement();
                if (!objs) {
                    $('body').unbind(namespace);
                    return;
                }
                var clicked_element = event === null || event === void 0 ? void 0 : event.target;
                let ty = currentInputType(clicked_element);
                if (ty) {
                    if (objs.Canvas.getVisibility() != 'Visible') {
                        TcHmi.TopMostLayer.addEx(objs.Element, {
                            centerHorizontal: true,
                            centerVertical: true,
                            closeOnBackground: true,
                            removeCb: objs.Hide
                        });
                        clicked_element.select();
                        objs.Canvas.setVisibility('Visible');
                    }
                    if (objs.mmid) {
                        let str = '';
                        let zz = clicked_element.parentNode; //(event as any).path;// composedPath;
                        do {
                            if (zz.id) {
                                let xx = TcHmi.Controls.get(zz.id);
                                if (xx && xx.getMinValue && xx.getMaxValue)
                                    str = `[ ${xx.getMinValue()} - ${xx.getMaxValue()} ]`;
                                break;
                            }
                        } while (zz = zz.parentNode);
                        objs.mm.setText(str);
                    }
                    let num = ty == 'number';
                    let kl = rs(num ? objs.Canvas.getNumericLayout() : objs.Canvas.getTextLayout());
                    objs.Keyboard.setLayoutFile(kl);
                    let inp = $(objs.Element).find('input');
                    if (inp && inp.length)
                        inp[0].type = ty == 'password' ? 'password' : 'text';
                    if (!num) {
                        //workaround to detect language changes
                        setTimeout(() => {
                            let nkl = rs(objs.Canvas.getTextLayout());
                            if (nkl != kl)
                                objs.Keyboard.setLayoutFile(nkl);
                        }, 100);
                    }
                }
            }
            ;
            $('body').bind(namespace, onclick);
        }
    });
})(TcHmi || (TcHmi = {}));
//# sourceMappingURL=BehindKeyboard.js.map