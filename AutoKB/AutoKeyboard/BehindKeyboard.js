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
        let objs;
        //when not in designer and also checks whether it's a system with built-in virtual keyboard
        if (TCHMI_DESIGNER !== true && navigator.userAgent.search(/Android|BlackBerry|iPhone|iPod|iPad|Opera Mini|IEMobile/i) < 0) {
            let namespace = 'click.auto.kb';
            function onclick() {
                objs = TcHmi.Functions.AutoKB.AKBElement();
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
                        //path property gets frowned upon by the compiler, but suggested composedPath doesn't work.
                        let zz = event.path; // composedPath;
                        for (var i = 0; i < zz.length; i++) {
                            if (zz[i].id) {
                                let xx = TcHmi.Controls.get(zz[i].id);
                                if (xx && xx.getMinValue && xx.getMaxValue)
                                    str = `[ ${xx.getMinValue()} - ${xx.getMaxValue()} ]`;
                                break;
                            }
                        }
                        objs.mm.setText(str);
                    }
                    let num = ty == 'number';
                    let kl = rs(num ? objs.Canvas.getNumericLayout() : objs.Canvas.getTextLayout());
                    objs.Keyboard.setLayoutFile(kl);
                    let inp = $(objs.Element).find('input');
                    if (inp && inp.length)
                        inp[0].type = ty == 'password' ? 'password' : 'text';
                    if (!num) {
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
            //let UC = $('[data-tchmi-target-user-control="AKB.usercontrol"],[data-tchmi-target-user-control*="/AKB.usercontrol"]');
            //if (!(UC && UC.length)) {
            //    console.error('AKB.usercontrol not found.');
            //    return;
            //}
            //    TcHmi.EventProvider.register(`${UC[0].id}.onAttached`, (e, d) => {
            //        e.destroy();
            //        objs = {};
            //        let Keyboard = UC.find("[data-tchmi-type='TcHmi.Controls.Beckhoff.TcHmiKeyboard']");
            //        if (!(Keyboard && Keyboard.length)) {
            //            console.error('TcHmiKeyboard element not found.');
            //            return;
            //        }
            //        let minmax = UC.find("[data-tchmi-type^='TcHmi.Controls.Beckhoff.TcHmiText']");
            //        if (minmax && minmax.length) {
            //            objs.mmid = minmax[0].id;
            //            objs.mm = TcHmi.Controls.get(objs.mmid);
            //        }
            //        objs.kid = Keyboard[0].id;
            //        objs.cid = UC[0].id;
            //        //in order for this to be accessible, tsconfig.tpl.json has to be edited, add package reference to "include" section:
            //        //    "$(Beckhoff.TwinCAT.HMI.Controls).InstallPath/TcHmiKeyboard/TcHmiKeyboard.d.ts"
            //        //objs.Keyboard = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiKeyboard>(objs.kid);
            //        //alternatively, use get without type declaration
            //        objs.Keyboard = TcHmi.Controls.get(objs.kid);
            //        objs.Canvas = TcHmi.Controls.get(objs.cid);
            //        objs.Element = objs.Canvas.getElement();
            //        objs.Hide = () => {
            //            TcHmi.TopMostLayer.removeEx(objs.Element);
            //            objs.Canvas.setVisibility('Collapsed');
            //        };
            //        TcHmi.EventProvider.register(`${objs.kid}.onIndirectInputAccepted`, objs.Hide);
            //        TcHmi.EventProvider.register(`${objs.kid}.onIndirectInputCanceled`, objs.Hide);
            //        objs.Hide();
            //    });
        }
    });
})(TcHmi || (TcHmi = {}));
//# sourceMappingURL=BehindKeyboard.js.map