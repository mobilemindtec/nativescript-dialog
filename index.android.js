var application = require("application");
var result;

exports.show = function (options) {
    return new Promise(function (resolve, reject) {
        try {
            if (options) {
                var alert = new android.support.v7.app.AlertDialog.Builder(application.android.currentContext);

                if (options.message) {
                  alert.setMessage(options.message);
                }

                if (options.title) {
                  alert.setTitle(options.title);
                }

                if (options.nativeView instanceof android.view.View) {
                    alert.setView(options.nativeView);
                }

                if (options.cancelButtonText) {
                    alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
                      onClick: function (dialog, id) {
                          dialog.cancel();
                          resolve(false);
                      }
                    }));
                }

                if (options.neutralButtonText) {
                    alert.setNeutralButton(options.neutralButtonText, new android.content.DialogInterface.OnClickListener({
          						onClick: function (dialog, id) {
          							dialog.cancel();
          							resolve(undefined);
          						}
          					}));
                }

                if (options.okButtonText) {
                    alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
          						onClick: function (dialog, id) {
          							dialog.cancel();
          							resolve(true);
          						}
          					}));
                }

                result = {};
                result.resolve = resolve,
                result.dialog = alert.show();

              if (options.textColor) {
                var textColor = android.graphics.Color.parseColor(options.textColor)
                var textViewId = application.android.currentContext.getResources().getIdentifier("android:id/alertTitle", null, null);
                if (textViewId) {
                  var tv = result.dialog.findViewById(textViewId);
                  if (tv) {
                      tv.setTextColor(textColor);
                  }
                }
              }
              if(options.titleColor){
                var titleColor = android.graphics.Color.parseColor(options.titleColor)
                var messageTextViewId = application.android.currentContext.getResources().getIdentifier("android:id/message", null, null);
                if (messageTextViewId) {
                  var messageTextView = result.dialog.findViewById(messageTextViewId);
                  if (messageTextView) {
                      messageTextView.setTextColor(titleColor);
                  }
                }
              }                 
            }
        } catch (ex) {
            reject(ex);
        }
    });
}

exports.close = function () {
  if(result){

    if(result.dialog instanceof android.support.v7.app.AlertDialog){
      result.dialog.cancel();
    }

    if(result.resolve instanceof Function){
      result.resolve(true);
    }
  }
}
