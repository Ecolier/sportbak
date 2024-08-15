import {SBKEventsIds} from '../../../shared/values/events-ids';
import {SBKEventsProvider} from '../../../shared/services/events.provider';

const ApplicationErrorsIds = {
  error_with_server: 'error_with_server',
  format_forbidden: 'format_forbidden',
  unable_to_get_nb_followers: 'unable_to_get_nb_followers',
  notifications: {
    no_notification_data: 'no_notification_ata',
    error_getting_notifications: 'error_getting_notifications',
  },
  games: {
    error_getting_game: 'error_getting_game',
    error_patching_game_date: 'error_patching_game_date',
  },
  bookings: {
    error_accepting_booking: 'error_accepting_booking',
    error_deleting_booking: 'error_deleting_booking',
    error_refusing_booking: 'error_refusing_booking',
    error_updating_booking: 'error_updating_booking',
    cannot_find_booking: 'cannot_find_booking',
    error_getting_upcoming_bookings: 'error_getting_upcoming_bookings',
    error_getting_bookings_of_day: 'error_getting_bookings_of_day',
  },
  users: {
    cannot_find_user: 'cannot_find_user',
  },
  players: {
    unable_to_get_players: 'unable_to_get_players',
    cannot_add_random_player: 'cannot_add_random_player',
    cannot_get_random_player: 'cannot_get_random_player',
  },
  shirts: {
    unable_to_get_shirts: 'unable_to_get_shirts',
    unable_to_send_shirt: 'unable_to_send_shirt',
    unable_to_delete_shirt: 'unable_to_delete_shirt',
  },
  competitions: {
    unable_to_get_competitions: 'unable_to_get_competitions',
    leagues: {
      unable_to_get_league: 'unable_to_get_league',
      unable_to_create_league: 'unable_to_create_league',
      unable_to_patch_league: 'unable_to_patch_league',
      unable_to_delete_league: 'unable_to_delete_league',
      unable_to_get_leagues: 'unable_to_get_leagues',
    },
    tournaments: {
      unable_to_get_tournament: 'unable_to_get_tournament',
      unable_to_create_tournament: 'unable_to_create_tournament',
      unable_to_patch_tournament: 'unable_to_patch_tournament',
      unable_to_delete_tournament: 'unable_to_delete_tournament',
      unable_to_get_tournaments: 'unable_to_get_tournaments',
    },
  },
};

let errorEventsProvider: SBKEventsProvider;

const setErrorEventsProvider = (eventsProvider: SBKEventsProvider) => {
  errorEventsProvider = eventsProvider;
};

/**
 * Allows to show the popup error to warn the user than an error occurred.
 * @param error the error you received or a message if none. It will be console.error.
 * @param errorMessageId the id that allow to get the translate message. You must take it from ApplicationsErrorsIds above.
 */
const showError = (error: any, errorMessageId: string) => {
  console.error(error);
  errorEventsProvider.publish(SBKEventsIds.openPopupError, errorMessageId);
};

export {ApplicationErrorsIds, setErrorEventsProvider, showError};
