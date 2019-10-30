
var lety = {
	'Praha > Londýn': 1034,
	'Praha > Moskva': 1668,
	'Praha > New York': 6568,
}

var ref_let = 'Praha > New York';


function format_cena(kc) {
	return "<b>" + kc.toFixed(0) + ",- Kč</b>" ;
}


// TODO hezci widgety na letadlo & auto

function letadlem_html(tuny_co2) {
		var let_co2 = lety[ref_let] * DATA.letadlo_co2_km_equiv / 1000;
		var ratio = tuny_co2 / let_co2;

		return "<b>" + ratio.toFixed(1) + "</b> letů <b>" + ref_let + "</b>";
}

function autem_html(tuny_co2) {
		var auto_km = 1000 * tuny_co2 / DATA.auto_co2_km_avg;
	// TODO tohle nejak divne zaokrouhluje - vegan 10 km za den , 3500 km za rok - WTF
		return "<b>" + auto_km.toFixed(0) + " km</b> ujetých osobním autem";
}

function format_perc(stuff){
	return (100*stuff).toFixed(0) + "%";
}

function format_co2(tuny_co2) {
	return tuny_co2.toFixed(2) + " tun CO<sub>2</sub>";
};

function format_co2_cmp(tuny_co2) {
	var cmp_html = "</b>, stejně jako " + letadlem_html(tuny_co2) + ", nebo " + autem_html(tuny_co2);
	return "za rok <b>" + format_co2(tuny_co2) + cmp_html;

	//var cmp_html = "Stejně jako " + letadlem_html(tuny_co2) + ", nebo " + autem_html(tuny_co2) + ".";
	//return '<a id="popoverData" class="btn text-primary" href="#" data-html="true" data-content="'+cmp_html+'" rel="popover" data-placement="bottom" data-trigger="hover">'+format_co2(tuny_co2) +'</a>';
};

var typy_jidelnicku = ['vegan', 'vegetarián', 'průměr ČR', 'masožrout'];
var jidelnicek = {
'vegan':DATA.jidlo_vegan_den,
'vegetarián':DATA.jidlo_vegetarian_den,
'průměr ČR':DATA.jidlo_avg_den,
'masožrout':DATA.jidlo_masozrout_den
};


function AppViewModel() {
	this.selJidelnicek = ko.observable(typy_jidelnicku[2]);
	this.jidlo_den = ko.computed(function() {
		return jidelnicek[this.selJidelnicek()];
	}, this);

	this.dum_spotreba = ko.observable(DATA.cr_domacnost_topeni_avg);

	this.cerpadlo_cop = ko.observable(3);
	this.cena_kwh = ko.observable(3);		// kc / kwh
	this.ucinnost_kotel_uhli = ko.observable(0.9); 

    this.elektrokotel_co2 = ko.computed(function() {
		return this.dum_spotreba() * DATA.elektrina_cr_mix_emise;
	}, this);

    this.kotel_na_plyn_co2 = ko.computed(function() {
		return this.dum_spotreba() * DATA.plyn_emise / 0.95;
	}, this);

    this.kotel_na_uhli_co2 = ko.computed(function() {
		return this.dum_spotreba() * DATA.hnede_uhli_emise / this.ucinnost_kotel_uhli();
	}, this);

    this.cerpadlo_co2 = ko.computed(function() {
		return this.dum_spotreba() * DATA.elektrina_cr_mix_emise / this.cerpadlo_cop();
	}, this);

}

// Activates knockout.js
ko.applyBindings(new AppViewModel());  
