import ko from 'knockout';
import arches from 'arches';
import defaultInitWorkflowTemplate from 'templates/views/components/plugins/init-workflow.htm';

const InitWorkflow = function (params) {
    this.workflows = params.workflows.map(function (wf) {
        wf.url = arches.urls.plugin(wf.slug);
        return wf;
    }, this);
};

export default ko.components.register('init-workflow', {
    viewModel: InitWorkflow,
    template: defaultInitWorkflowTemplate,
});
