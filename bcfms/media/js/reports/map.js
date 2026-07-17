import _ from 'underscore';
import ko from 'knockout';
import koMapping from 'knockout-mapping';
import MapReportViewModel from 'viewmodels/map-report';
import BcfmsReportViewModel from 'viewmodels/bcfms-report';
import mapReportTemplate from 'templates/views/report-templates/map.htm';
const viewModel = function (params) {
    params.configKeys = [];
    MapReportViewModel.apply(this, [params]);
    BcfmsReportViewModel.apply(this, [params]);
};

export default ko.components.register('map-report', {
    viewModel: viewModel,
    template: mapReportTemplate,
});
