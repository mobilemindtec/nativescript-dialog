var dialogsCommon = require("ui/dialogs/dialogs-common");
var colorModule = require("color");
var Color = colorModule.Color;

var result;

exports.show = function (options) {
    return new Promise(function (resolve, reject) {
        try {
            if (options) {
                var alert = SDCAlertController.alloc().initWithTitleMessagePreferredStyle(options.title || "", options.message || "", UIAlertControllerStyleAlert);

                if (options.nativeView instanceof UIView) {
                    alert.contentView.addSubview(options.nativeView);

                    if(options.nativeView.centerXAnchor) {
                      options.nativeView.translatesAutoresizingMaskIntoConstraints = false;
                      options.nativeView.centerXAnchor.constraintEqualToAnchor(alert.contentView.centerXAnchor).active = true;
                      options.nativeView.topAnchor.constraintEqualToAnchor(alert.contentView.topAnchor).active = true;
                      options.nativeView.bottomAnchor.constraintEqualToAnchor(alert.contentView.bottomAnchor).active = true;
                    } else {
                      var xCenterConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(options.nativeView, NSLayoutAttributeCenterX, NSLayoutRelationEqual, alert.contentView, NSLayoutAttributeCenterX, 1.0, 0);
                      alert.contentView.addConstraint(xCenterConstraint);

                      var yCenterConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(options.nativeView, NSLayoutAttributeCenterY, NSLayoutRelationEqual, alert.contentView, NSLayoutAttributeCenterY, 1.0, 0);
                      alert.contentView.addConstraint(yCenterConstraint);

                      var views = {"newView": options.nativeView};

                      var widthConstraints = NSLayoutConstraint.constraintsWithVisualFormatOptionsMetricsViews("H:[newView(100)]", 0, null, views);
                      alert.contentView.addConstraints(widthConstraints);

                      var heightConstraints = NSLayoutConstraint.constraintsWithVisualFormatOptionsMetricsViews("V:[newView(100)]", 0, null, views);
                      alert.contentView.addConstraints(heightConstraints);
                    }
                }

                if (options.cancelButtonText) {
                    alert.addAction(SDCAlertAction.alloc().initWithTitleStyleHandler(options.cancelButtonText,
                        UIAlertActionStyleDefault, function (args) {
                            resolve(false);
                        }));
                }

                if (options.neutralButtonText) {
                    alert.addAction(SDCAlertAction.alloc().initWithTitleStyleHandler(options.neutralButtonText,
                        UIAlertActionStyleDefault, function (args) {
                            resolve(undefined);
                        }));
                }

                if (options.okButtonText) {
                    alert.addAction(SDCAlertAction.alloc().initWithTitleStyleHandler(options.okButtonText,
                        UIAlertActionStyleDefault, function (args) {
                            resolve(true);
                        }));
                }

                if(options.titleColor){
                  var color = new Color(options.titleColor);
                  var attrStr = alert.attributedTitle.mutableCopy()
                  attrStr.addAttributeValueRange(NSForegroundColorAttributeName, color.ios, NSMakeRange(0, attrStr.string.length));
                  alert.attributedTitle = attrStr
                }

                if(options.textColor){
                  var color = new Color(options.textColor);
                  var attrStr = alert.attributedMessage.mutableCopy()
                  attrStr.addAttributeValueRange(NSForegroundColorAttributeName, color.ios, NSMakeRange(0, attrStr.string.length));
                  alert.attributedMessage = attrStr
                }

                result = {};
                result.resolve = resolve,
                result.dialog = alert;

                if (alert) {
                  var currentPage = dialogsCommon.getCurrentPage();
                  if (currentPage) {
                    var viewController = currentPage.ios;
                    if (viewController) {
                      viewController.presentViewControllerAnimatedCompletion(alert, true, null);
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

    if(result.dialog instanceof SDCAlertController){
      result.dialog.dismissAnimatedCompletion(true, null);
    }

    if(result.resolve instanceof Function){
      result.resolve(true);
    }
  }
}
