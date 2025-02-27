define([
    'jquery',
    'knockout',
    'underscore',
    'viewmodels/widget',
    'viewmodels/alert',
    'arches',
    'templates/views/components/widgets/report-number-widget.htm'
], function ($, ko, _, WidgetViewModel, AlertViewModel, arches, reportNumberWidgetTemplate) {
    /**
     * registers a report-number-widget component for use in forms
     * Extension of non-localized-text widget
     * @function external:"ko.components".text-widget
     * @param {object} params
     * @param {string} params.value - the value being managed
     * @param {function} params.config - observable containing config object
     * @param {string} params.config().label - label to use alongside the text input
     * @param {string} params.config().placeholder - default text to show in the text input
     * @param {string} params.config().uneditable - disables widget
     */

    const viewModel = function (params) {
        params.configKeys = ['placeholder', 'width', 'maxLength', 'defaultValue', 'uneditable', 'reportTypeAbbreviation', 'submissionTypeNodeAlias'];

        WidgetViewModel.apply(this, [params]);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        self.urls = arches.urls;

        this.disable = ko.computed(() => {
            return ko.unwrap(self.disabled) ||
                ko.unwrap(self.uneditable) ||
                !!ko.unwrap(self.value) ||
                ko.unwrap(self.controlWidgetEmpty);
        }, self);

        self.placeholder = ko.computed(() => {
            const year = new Date().getFullYear();
            const abbr = ko.unwrap(self.submissionTypeNodeAlias) ? `<${ko.unwrap(self.submissionTypeNodeAlias)}>` : ko.unwrap(self.reportTypeAbbreviation);
            return `${year}-${abbr}-000`;
        });

        self.controlWidgetEmpty = ko.computed(() => {
            // The widget isn't driven by a control widget, it's a straight abbreviation
            if (!this.config().submissionTypeNodeAlias && this.config().reportTypeAbbreviation || !ko.unwrap(this.form)) {
                return false;
            }
            const node = _.find(this.form.nodeLookup, (node) => {
                return node.alias && node.alias() === this.config().submissionTypeNodeAlias;
            });
            return !node || !ko.unwrap(self.tile.data[node.noodeid]);
        });

        self.getReportNumber = function () {
            let url = `${self.urls.root}get_next_report_number/${self.node.id}?`;
            if (ko.unwrap(self.widget.config.reportTypeAbbreviation)) {
                url = url + `abbreviation=${ko.unwrap(self.widget.config.reportTypeAbbreviation)}`;
            } else {
                    const node = _.find(self.widget.card.nodes(), node => {
                        return ko.unwrap(node.alias) === ko.unwrap(self.widget.config.submissionTypeNodeAlias);
                    });
                    url = url + `valueId=${ko.unwrap(self.tile.data[node.nodeid])}`;
            }
            self.form.loading(true);
            $.ajax({
                // type: "PUT",
                url: url
            }).done(function (data) {
                self.form.loading(false);
                if (data.status === "success") {
                    self.value(data.report_number);
                }
                else
                {
                     self.form.alert(new AlertViewModel(
                        'ep-alert-red',
                        'Submission type required',
                        'Please select a submission type before generating submission number',
                        null,
                        function(){}
                    ));
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(errorThrown);
                self.form.alert(new AlertViewModel(
                    'ep-alert-red',
                    `Unable to get submission number: ${textStatus}`,
                    `Please check the browser console for details`,
                    null,
                    function(){}
                ));
                self.form.loading(false);
            });
        };
    };

    return ko.components.register('report-number-widget', {
        viewModel: viewModel,
        template: reportNumberWidgetTemplate
    });
});
