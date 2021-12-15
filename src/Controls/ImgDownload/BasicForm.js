import React from 'react';
import Toggle from 'react-toggle';
import { t } from 'ttag';

import { IMAGE_FORMATS, IMAGE_FORMATS_INFO } from './consts';

export default class BasicForm extends React.Component {
  OVERLAY_DISABLED_TITLE = t`Map overlay is disabled when AOI is specified. Remove your AOI in order to use this option.`;
  OVERLAY_TITLE = t`The map's overlay layers (place labels, streets and political boundaries) will be added to the image.`;
  CAPTIONS_DISABLED_LOGGED_OUT_TITLE = t`You need to login to use this functionality.`;
  CAPTIONS_TITLE = t`Exported image(s) will include datasource and date, zoom scale and branding.`;
  DESCRIPTION_DISABLED_TITLE = t`Enable captions in order to write a description.`;
  DESCRIPTION_TITLE = t`Add a short description to the exported image.`;
  LEGEND_DISABLED_TITLE = t`Layer does not have any legend data.`;
  LEGEND_TITLE = t`Exported image will include legend.`;

  componentDidMount() {
    const { updateFormData, addingMapOverlaysPossible } = this.props;
    if (!addingMapOverlaysPossible) {
      updateFormData('addMapOverlays', false);
    }
  }

  render() {
    const {
      showCaptions,
      updateFormData,
      addMapOverlays,
      showLegend,
      userDescription,
      hasLegendData,
      addingMapOverlaysPossible,
      onErrorMessage,
      imageFormat,
      isUserLoggedIn,
      isBasicForm,
    } = this.props;
    return (
      <div>
        <div className={`form-field ${isUserLoggedIn ? '' : 'disabled'}`}>
          <label title={isUserLoggedIn ? this.CAPTIONS_TITLE : this.CAPTIONS_DISABLED_LOGGED_OUT_TITLE}>
            <div>{t`Show captions`}</div>
            <i
              className="fa fa-question-circle"
              onClick={() => {
                onErrorMessage(
                  isUserLoggedIn ? this.CAPTIONS_TITLE : this.CAPTIONS_DISABLED_LOGGED_OUT_TITLE,
                );
              }}
            />
          </label>
          <div className="form-input">
            <Toggle
              checked={showCaptions}
              icons={false}
              onChange={() => updateFormData('showCaptions', !showCaptions)}
            />
          </div>
        </div>
        {isBasicForm && (
          <div className={`form-field ${addingMapOverlaysPossible ? '' : 'disabled'}`}>
            <label title={addingMapOverlaysPossible ? this.OVERLAY_TITLE : this.OVERLAY_DISABLED_TITLE}>
              <div>{t`Add map overlays`}</div>
              <i
                className={`fa fa-question-circle ${addingMapOverlaysPossible ? '' : 'disabled'}`}
                onClick={() => {
                  onErrorMessage(
                    addingMapOverlaysPossible ? this.OVERLAY_TITLE : this.OVERLAY_DISABLED_TITLE,
                  );
                }}
              />
            </label>
            <div className="form-input">
              <Toggle
                checked={addMapOverlays}
                icons={false}
                onChange={() => updateFormData('addMapOverlays', !addMapOverlays)}
              />
            </div>
          </div>
        )}
        <div className={`form-field ${hasLegendData ? '' : 'disabled'}`}>
          <label title={hasLegendData ? this.LEGEND_TITLE : this.LEGEND_DISABLED_TITLE}>
            <div>{t`Show legend`}</div>
            <i
              className="fa fa-question-circle"
              onClick={() => {
                onErrorMessage(hasLegendData ? this.LEGEND_TITLE : this.LEGEND_DISABLED_TITLE);
              }}
            />
          </label>
          <div className="form-input">
            <Toggle
              checked={showLegend}
              icons={false}
              onChange={() => updateFormData('showLegend', !showLegend)}
            />
          </div>
        </div>
        <div className={`form-field ${showCaptions ? '' : 'disabled'}`}>
          <label title={showCaptions ? this.DESCRIPTION_TITLE : this.DESCRIPTION_DISABLED_TITLE}>
            <div>{t`Description`}</div>
            <i
              className={`fa fa-question-circle ${showCaptions ? '' : 'disabled'}`}
              onClick={() => {
                onErrorMessage(showCaptions ? this.DESCRIPTION_TITLE : this.DESCRIPTION_DISABLED_TITLE);
              }}
            />
          </label>
          <div className="form-input">
            <input
              className="full-width"
              value={userDescription}
              onChange={(ev) => updateFormData('userDescription', ev.target.value)}
              maxLength="64"
            />
          </div>
        </div>
        <div className="form-field">
          <label>{t`Image format:`}</label>
          <div className="form-input">
            <select
              className="dropdown"
              value={imageFormat}
              onChange={(e) => updateFormData('imageFormat', e.target.value)}
            >
              <option value={IMAGE_FORMATS.JPG}>{IMAGE_FORMATS_INFO[IMAGE_FORMATS.JPG].text}</option>
              <option value={IMAGE_FORMATS.PNG}>{IMAGE_FORMATS_INFO[IMAGE_FORMATS.PNG].text}</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
