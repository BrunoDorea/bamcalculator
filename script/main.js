var precoBam = [0, 0, 125000, 187500, 250000, 312500, 375000];
    
            function numberFormat(_number, _sep) {
                _number = typeof _number != "undefined" && _number > 0 ? String(_number) : "";
                _number = _number.replace(new RegExp("^(\\d{" + (_number.length % 3 ? _number.length % 3 : 0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
                if (typeof _sep != "undefined" && _sep != " ") {
                    _number = _number.replace(/\s/g, _sep);
                }
                return _number == 0 ? "0" : _number;
            }
    
            function atualizaTotal() {
                var goldTotal = 0;
                var bamTotal = 0;
    
                for (var i = 2; i <= 6; i++) {
                    var obj = $("[data-bam=" + (+i) + "]");
    
                    if (i == 2)
                        bamTotal = 50 * +(obj.find(".count").html());
    
                    goldTotal += +(obj.find("#totalGold").html().replace(/(\D)/g, ""));
    
                    var thisBam = obj.find("#BAMCount").html();
                    obj.find(".decrease").removeClass("disable");
                    obj.find(".button.cancel").removeClass("disable");
    
                    if (+thisBam <= 0) {
                        obj.find(".decrease").addClass("disable");
                        obj.find(".button.cancel").addClass("disable");
                    }
                }
    
                $("#totalGoldBAM").html(numberFormat(goldTotal, "."));
                $("#totalBAM").html(numberFormat(bamTotal, "."));
            };
    
            function addOneBam(num, quant, nextBam) {
                if (num == 1) {
                    return;
                }
    
                var parent = $("[data-bam=" + num + "]");
    
                var quantidadeAtual = parent.find(".count").html();
                quantidadeAtual = quant + +quantidadeAtual;
                if (quantidadeAtual < 0)
                    quantidadeAtual = 0;
                quantidadeExtra = quantidadeAtual;
    
                if (num < 6) {
                    var parentProximo = $("[data-bam=" + (+num + 1) + "]");
                    var quantidadeProximo = parentProximo.find(".count").html();
                    quantidadeExtra -= +quantidadeProximo * 2;
                }
    
                if (quantidadeExtra < 0)
                    return;
    
                parent.find(".count").html(quantidadeAtual);
                parent.find("#BAMCount").html(quantidadeExtra);
                parent.find("#totalGold").html(numberFormat(+quantidadeAtual * precoBam[num], "."));
    
                atualizaTotal();
    
                if (nextBam === true)
                    addOneBam(num - 1, quant * 2, true);
            };
    
            function resetBam(num, nextBam) {
                if (num == 1) {
                    return;
                }
    
                var parent = $("[data-bam=" + num + "]");
                
                var quantidadeExtra = parent.find("#BAMCount").html();
                var quantidadeAtual = parent.find(".count").html();
    
                if (+quantidadeExtra > 0)
                {
                    var sobra = +quantidadeExtra;
                    quantidadeAtual = +quantidadeAtual - sobra;
                    quantidadeExtra = 0;
                    
                    parent.find(".count").html(quantidadeAtual);
                    parent.find("#BAMCount").html(quantidadeExtra);
                    parent.find("#totalGold").html(numberFormat(+quantidadeAtual * precoBam[num], "."));
                    
                    addOneBam(num-1, sobra *-2, true);
                }
    
                atualizaTotal();
    
                if (nextBam === true)
                    resetBam(num - 1, true);
            }
    
            $(function () {
                $("[data-bam]").on("click", ".increase", function () {
                    addOneBam($(this).parents("[data-bam]").attr("data-bam"), 1, true);
                });
    
                $("[data-bam]").on("click", ".decrease", function () {
                    if ($(this).hasClass("disable"))
                        return;
                    addOneBam($(this).parents("[data-bam]").attr("data-bam"), -1, true);
                });
    
                $("[data-bam]").on("click", ".button.cancel", function () {
                    if ($(this).hasClass("disable"))
                        return;
                    resetBam($(this).parents("[data-bam]").attr("data-bam"), false);
                });
    
                $("div.footer").on("click", ".button.cancel", function () {
                    resetBam(6, true);
                });
            });