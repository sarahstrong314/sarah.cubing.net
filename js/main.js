$(document).ready(function() {
  $("#content").addClass($("#content > div").attr('id'));

  // Focussing on one particular algorithm.
  $(".alg-list li").click(function(ev) {
    var $li = $(ev.target).closest("li");
    var $algs = $(".alg-list li#" + $li.attr('id') + ", .alg-list li." + $li.attr('id'));
    var activeAlgPosition;

    // Update .alg-list view to indicate which alg is active.
    $(".alg-list li").not($algs).find(".overview").removeClass('active').addClass('inactive');
    $algs.find(".overview").removeClass('inactive');
    $algs.addClass('active');

    // Start to prepare the alg for display in #active-algs.
    $algs = $algs.clone();

    // Form title from the alg name (short name) and alg nickname, if applicable.
    $algs.each(function(i, el) {
      if ($(el).find(".alg-name").length > 0) {
        $(el).find(".details h3").prepend($(el).find(".alg-name").text() + ": ").show();
        $(el).find(".alg-name").remove();
      }
    });

    // Use a fade to transition to the new active alg.
    if ($("#active-algs").is(":visible")) {
      $("#active-algs").fadeOut('fast', function() {
        $(this).empty();
        $(this).append($algs).fadeIn('fast');
      });
    } else {
      $("#active-algs").append($algs).slideDown('fast');
    }

    // Scroll up to #active-algs, if needed.
    activeAlgPosition = $('#active-algs').position().top;

    if ($('body').scrollTop() > activeAlgPosition) {
      $('body').animate({scrollTop: activeAlgPosition}, 500);
    }

    // Update URL in order to create a permalink to this particular alg.
    document.location.hash = "#alg/" + $algs.first().attr('id');
  });

  // Switching sub-views of algorithms.
  $(".tabs li").click(function(ev) {
    var $li = $(ev.target).closest("li");
    var $activeTab = $(".tabs li.active")
    var $prependTitle = $(".prepend-title");
    var $activeSection, $newSection, $newTitle, newHash;

    // Don't switch between tabs if the user clicked the current tab.
    if ($li !== $activeTab) {
      // Update tab appearance.
      $(".tabs li").removeClass('active');
      $li.addClass('active');

      $("#active-algs").slideUp('fast', function() {
        $("#active-algs").empty();
        $(".inactive").removeClass('inactive');
      });

      $newSection = $(".section." + $li.attr('id'));

      // Fade out old content if a tab was previously selected.
      if ($activeTab.length > 0) {
        $activeSection = $(".section." + $activeTab.attr('id'));
        $activeSection.fadeOut('fast', function() {
          $newSection.fadeIn('fast');
        });
      } else {
        $newSection.fadeIn('fast');
      }

      // Join subtitle with title, if applicable.
      if ($prependTitle.length > 0) {
        $('.joined-title').remove();
        $newTitle = $prependTitle.hide().clone().removeClass('prepend-title').addClass('joined-title');
        $newTitle.append(" &mdash; " + $newSection.find(".append-title").text());
        $prependTitle.parent().prepend($newTitle);
        $newSection.find(".append-title").hide();
        $newTitle.show();
      }

      newHash = "section/" + $li.attr('id');
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }
    }
  });

  $("nav li h3").click(function(ev) {
    var $li = $(ev.target).closest("li");

    if ($li.find("ul").is(":visible")) {
      $li.find("ul").slideUp('fast');
    } else {
      $("nav li").not($li).find("ul").slideUp('fast');
      $li.find("ul").slideDown('fast');
    }
  });

  $("[data-show-cheat-sheet]").click(function() {
    $(this).hide();
    $("#cheat-sheet").show();
  });

  var navigateWithHash = function() {
    if (document.location.hash !== "") {
      // Automatically open tab/alg specified in hash.
      var tab, $algLi, $algList;

      // Activate this particular algorithm.
      if (document.location.hash.indexOf('alg/') === 1) {
        $algLi = $(".alg-list li#" + document.location.hash.substr(5));
        $algList = $algLi.closest('ul');

        // Determine tab from class name.
        $(".tabs li").each(function(i, el) {
          if ($algList.hasClass($(el).attr('id'))) {
            tab = $(el).attr('id');
            return false;
          }
        });
      } else {
        // Handle slide numbers in hash
        const hashParts = document.location.hash.substr(9).split('-');
        tab = hashParts[0];
        const slideNum = parseInt(hashParts[1]);

        // After a short delay to let the tab content load
        setTimeout(() => {
          if (!isNaN(slideNum)) {
            const section = document.querySelector(`.section.${tab} .slideshow-section`);
            if (section && section.setSlide) {
              section.setSlide(slideNum);
            }
          }
        }, 100);
      }

      // Activate this tab, if this page supports tabs.
      if ($(".collapsible").length > 0) {
        $(".tabs li#" + tab).not(".active").click();
      }

      if ($algLi !== undefined) {
        $algLi.not(".active").click();
      }
    }
  };

  $(window).on('hashchange', navigateWithHash);
  navigateWithHash();

  var path = document.location.pathname.replace('.html', '');
  $("nav").find("a[href='" + path + "']").closest("ul").show();
});
