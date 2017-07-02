/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        $('#scan').click(function() {app.scan();});
        $('#logo_image').hide();
        $('#product_img').hide();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    },

    scan: function(){
        console.log('scanning');
        console.log(cordova.plugins.barcodeScanner);
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                $('#return_value').hide();
                $('#barcode_receiver').hide();
                $('#product_img').hide();
                $('#barcode_receiver').innerText = result.text;
                $('#logo_image').show();
                 $.ajax({
                    url : "https://ssl-api.openfoodfacts.org/code/"+result.text+".json", // La ressource ciblée
                    type : 'GET', // Le type de la requête HTTP
                    dataType : 'text', // Le type de données à recevoir, ici, du JSON.
                    success : function(json, statut){ // json contient le JSON renvoyé
                        var response = JSON.parse(json);
                        if(response.products && response.products.length > 0){
                            console.log(response.products);
                            if(response.products[0].allergens_tags.includes('en:gluten')){
                                $('#return_value').text('Il y a du gluten dans le produits');
                            }else{
                               $('#return_value').text('Pas de gluten');
                            }
                            if(response.products[0].image_url && response.products[0].image_url != ""){
                                $('#product_img').attr('src',response.products[0].image_url);
                            }
                        }else{
                            $('#return_value').text('Produit inexistant OFF');
                        }
                        $('#logo_image').hide();
                        $('#return_value').show();
                        $('#product_img').show();
                        $('#barcode_receiver').show();
                    },
                    error : function(resultat, statut, erreur){
                        console.log(resultat);
                        console.log(statut);
                        console.log(erreur);
                        $('#return_value').text('La réponse indique une erreur');
                        $('#barcode_receiver').show();
                    }
                });
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera : false, // iOS and Android
                showFlipCameraButton : true, // iOS and Android
                showTorchButton : true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                prompt : "Placez le code barau centre de l'écran", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats : "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
                orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations : true, // iOS
                disableSuccessBeep: false // iOS
            }
        );
    }
};

app.initialize();