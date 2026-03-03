import ko from 'knockout';
import _ from 'underscore';
import WidgetViewModel from 'viewmodels/widget';
const BooleanCheckboxWidgetViewModel = function (params) {
    var self = this;

    WidgetViewModel.apply(this, [params]);

    var value = self.configForm ? self.defaultValue : self.value;

    this.toggleSelected = function () {
        var selected = !self.isSelected();
        console.log(`Setting selected to ${selected}`);
        self.setSelected(selected);
    };

    this.setSelected = function (selected) {
        if (ko.unwrap(self.disabled) === false) {
            value(selected);
        }
    };

    this.isSelected = function () {
        return !!value();
    };
};

export default BooleanCheckboxWidgetViewModel;
