$(document).ready(function () {
    $('.sidenav').sidenav();
});

$(document).ready(function () {
    $('select').formSelect();
});

$('.saveInput').on('change', function () {
    $('#saveInfoBtn').removeClass("disabled");
});


$(document).on('click', '.followBtn', {}, function (e) {
    let user_to_follow = event.target.id.split("follow_")[1];
    $.ajax({
        url: '/optimr/getCurrentUser',
        type: 'get',
        success: function (data) {
            console.log(data);
            data.user_to_follow = user_to_follow;
            $.ajax({
                url: '/optimr/follow',
                type: 'post',
                data: data,
                success: function (data) {
                    $("#usersCollection").load(location.href + " #usersCollection>*", "");
                    $("#followCollection").load(location.href + " #followCollection>*", "");
                    M.toast({html: 'Nouvel abonnement', classes: 'rounded green center'});
                }
            })
        }
    })
});

$(document).on('click', '.unfollowBtn', {}, function (e) {
    let user_to_unfollow = event.target.id.split("unfollow_")[1];
    $.ajax({
        url: '/optimr/getCurrentUser',
        type: 'get',
        success: function (data) {
            data.user_to_unfollow = user_to_unfollow;
            $.ajax({
                url: '/optimr/unfollow',
                type: 'post',
                data: data,
                success: function (data) {
                    $("#usersCollection").load(location.href + " #usersCollection>*", "");
                    $("#followCollection").load(location.href + " #followCollection>*", "");
                    M.toast({html: 'Désabonné', classes: 'rounded orange center'});
                }
            })
        }
    })
});
