const AngularComponentA = {
    template: `
    <div>
        <div>This is an Angular page!</div>
        <ng-foo-button />
    </div>`
};

const AngularComponentB = {
    template: `
    <div>
        Another Angular page.
        <ng-vue-wrapper component-name="cool-component" />
    </div>`
};

angular
.module(
    "viaApp",
    [ "ngRoute" ]
)
.config(
    [
        '$routeProvider',
        '$locationProvider',
        function config($routeProvider, $locationProvider) {
            $routeProvider
            .when('/angularA', AngularComponentA)
            .when('/angularB', AngularComponentB)
            .when('/vueA', {
                template: '<ng-vue-root />'
            })
            .when('/vueB', {
                template: '<ng-vue-root />'
            })
            .otherwise('/angularA');

            $locationProvider.html5Mode(true);
        }
    ]
)
.controller(
    "tabsController",
    [
        "$scope",
        "$location",
        function(
            $scope,
            $location
        ) {
            $scope.tabs = ["angularA", "angularB", "vueA", "vueB"];
            $scope.onClick = function(tab) {
                $location.path(tab);
            }
        }
    ]
)
.component(
    "ngFooButton",
    {
        template: 'Angular component: <button ng-click="onClick()">Foo is {{ foo }}</button>',
        controller: function($scope) {
            this.$onInit = function() {
                this.fooWatch = $scope.$watch(
                    () => vuexStore.getters['foo'],
                    (value) => { $scope.foo = value; }
                );

                $scope.onClick = function() {
                    vuexStore.dispatch('increment');
                }
            }

            this.$onDestroy = function() {
                this.fooWatch();
            }
        }
    }
)
.component(
    "ngVueRoot",
    {
        template: "<div ng-non-bindable id='vue-root'><router-view /></div>",
        controller: function() {
            this.$onInit = function() {
                this.vueRoot = new Vue({
                    el: "#vue-root",
                    router: vueRouter,
                    store: vuexStore
                });
            }

            this.$onDestroy = function() {
                this.vueRoot.$destroy();
            }
        }
    }
)
.component(
    "ngVueWrapper",
    {
        bindings: {
            componentName: "@"
        },
        controller: function($element) {
            this.$onInit = function() {
                this.vueComponent = new Vue({
                    template: `<div ng-non-bindable class="vue-wrapper"><${this.componentName} /></div>`,
                    store: vuexStore
                }).$mount();
                $element[0].appendChild(this.vueComponent.$el);
            }

            this.$onDestroy = function() {
                this.vueComponent.$destroy();
            }
        }
    }
);
