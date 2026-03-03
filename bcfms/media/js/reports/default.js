import ko from 'knockout';
import ReportViewModel from 'viewmodels/bcfms-report';
import defaultTemplate from 'templates/views/report-templates/bcfms_default.htm';
const viewModel = function (params) {
    params.configKeys = [];
    ReportViewModel.apply(this, [params]);
};

export default ko.components.register('default-report', {
    viewModel: viewModel,
    template: defaultTemplate,
});
