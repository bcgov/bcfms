import $ from 'jquery';
import _ from 'underscore';
import arches from 'arches';
import ko from 'knockout';
import koMapping from 'knockout-mapping';
import FunctionViewModel from 'viewmodels/function-view-model';
import chosen from 'bindings/chosen';
import simpleSwitch from 'views/components/simple-switch';
import defaultFossilsDescriptorsTemplate from 'templates/views/components/functions/bc-fossil-type-descriptors.htm';
export default ko.components.register(
    'views/components/functions/bc-fossil-type-descriptors',
    {
        viewModel: function (params) {
            FunctionViewModel.apply(this, arguments);

            this.reindexdb = function () {
                this.loading(true);
                $.ajax({
                    type: 'POST',
                    url: arches.urls.reindex,
                    context: this,
                    data: JSON.stringify({ graphids: [this.graph.graphid] }),
                    error: function () {
                        console.log('error');
                    },
                    complete: function () {
                        this.loading(false);
                    },
                });
            };

            window.setTimeout(function () {
                $('select[data-bind^=chosen]').trigger('chosen:updated');
            }, 300);
        },
        template: defaultFossilsDescriptorsTemplate,
    },
);
